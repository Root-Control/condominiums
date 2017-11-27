'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Condominium = mongoose.model('Condominium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  condominium;

/**
 * Condominium routes tests
 */
describe('Condominium Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new condominium
    user.save()
      .then(function () {
        condominium = {
          name: 'Condominium Name',
          content: 'Condominium Adrress'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an condominium if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new condominium
        agent.post('/api/condominiums')
          .send(condominium)
          .expect(200)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Handle condominium save error
            if (condominiumSaveErr) {
              return done(condominiumSaveErr);
            }

            // Get a list of condominiums
            agent.get('/api/condominiums')
              .end(function (condominiumsGetErr, condominiumsGetRes) {
                // Handle condominium save error
                if (condominiumsGetErr) {
                  return done(condominiumsGetErr);
                }

                // Get condominiums list
                var condominiums = condominiumsGetRes.body;

                // Set assertions
                (condominiums[0].user._id).should.equal(userId);
                (condominiums[0].name).should.match('Condominium Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an condominium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new condominium
        agent.post('/api/condominiums')
          .send(condominium)
          .expect(200)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Handle condominium save error
            if (condominiumSaveErr) {
              return done(condominiumSaveErr);
            }

            // Update condominium title
            condominium.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing condominium
            agent.put('/api/condominiums/' + condominiumSaveRes.body._id)
              .send(condominium)
              .expect(200)
              .end(function (condominiumUpdateErr, condominiumUpdateRes) {
                // Handle condominium update error
                if (condominiumUpdateErr) {
                  return done(condominiumUpdateErr);
                }

                // Set assertions
                (condominiumUpdateRes.body._id).should.equal(condominiumSaveRes.body._id);
                (condominiumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an condominium if no title is provided', function (done) {
    // Invalidate title field
    condominium.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new condominium
        agent.post('/api/condominiums')
          .send(condominium)
          .expect(422)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Set message assertion
            (condominiumSaveRes.body.message).should.match('Title cannot be blank');

            // Handle condominium save error
            done(condominiumSaveErr);
          });
      });
  });

  it('should be able to delete an condominium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new condominium
        agent.post('/api/condominiums')
          .send(condominium)
          .expect(200)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Handle condominium save error
            if (condominiumSaveErr) {
              return done(condominiumSaveErr);
            }

            // Delete an existing condominium
            agent.delete('/api/condominiums/' + condominiumSaveRes.body._id)
              .send(condominium)
              .expect(200)
              .end(function (condominiumDeleteErr, condominiumDeleteRes) {
                // Handle condominium error error
                if (condominiumDeleteErr) {
                  return done(condominiumDeleteErr);
                }

                // Set assertions
                (condominiumDeleteRes.body._id).should.equal(condominiumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single condominium if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new condominium model instance
    condominium.user = user;
    var condominiumObj = new Condominium(condominium);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new condominium
        agent.post('/api/condominiums')
          .send(condominium)
          .expect(200)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Handle condominium save error
            if (condominiumSaveErr) {
              return done(condominiumSaveErr);
            }

            // Get the condominium
            agent.get('/api/condominiums/' + condominiumSaveRes.body._id)
              .expect(200)
              .end(function (condominiumInfoErr, condominiumInfoRes) {
                // Handle condominium error
                if (condominiumInfoErr) {
                  return done(condominiumInfoErr);
                }

                // Set assertions
                (condominiumInfoRes.body._id).should.equal(condominiumSaveRes.body._id);
                (condominiumInfoRes.body.title).should.equal(condominium.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (condominiumInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Condominium.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
