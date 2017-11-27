'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tower = mongoose.model('Tower'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tower;

/**
 * Tower routes tests
 */
describe('Tower Admin CRUD tests', function () {
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

    // Save a user to the test db and create new tower
    user.save()
      .then(function () {
        tower = {
          title: 'Tower Title',
          content: 'Tower Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an tower if logged in', function (done) {
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

        // Save a new tower
        agent.post('/api/towers')
          .send(tower)
          .expect(200)
          .end(function (towerSaveErr, towerSaveRes) {
            // Handle tower save error
            if (towerSaveErr) {
              return done(towerSaveErr);
            }

            // Get a list of towers
            agent.get('/api/towers')
              .end(function (towersGetErr, towersGetRes) {
                // Handle tower save error
                if (towersGetErr) {
                  return done(towersGetErr);
                }

                // Get towers list
                var towers = towersGetRes.body;

                // Set assertions
                (towers[0].user._id).should.equal(userId);
                (towers[0].title).should.match('Tower Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an tower if signed in', function (done) {
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

        // Save a new tower
        agent.post('/api/towers')
          .send(tower)
          .expect(200)
          .end(function (towerSaveErr, towerSaveRes) {
            // Handle tower save error
            if (towerSaveErr) {
              return done(towerSaveErr);
            }

            // Update tower title
            tower.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing tower
            agent.put('/api/towers/' + towerSaveRes.body._id)
              .send(tower)
              .expect(200)
              .end(function (towerUpdateErr, towerUpdateRes) {
                // Handle tower update error
                if (towerUpdateErr) {
                  return done(towerUpdateErr);
                }

                // Set assertions
                (towerUpdateRes.body._id).should.equal(towerSaveRes.body._id);
                (towerUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an tower if no title is provided', function (done) {
    // Invalidate title field
    tower.title = '';

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

        // Save a new tower
        agent.post('/api/towers')
          .send(tower)
          .expect(422)
          .end(function (towerSaveErr, towerSaveRes) {
            // Set message assertion
            (towerSaveRes.body.message).should.match('Title cannot be blank');

            // Handle tower save error
            done(towerSaveErr);
          });
      });
  });

  it('should be able to delete an tower if signed in', function (done) {
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

        // Save a new tower
        agent.post('/api/towers')
          .send(tower)
          .expect(200)
          .end(function (towerSaveErr, towerSaveRes) {
            // Handle tower save error
            if (towerSaveErr) {
              return done(towerSaveErr);
            }

            // Delete an existing tower
            agent.delete('/api/towers/' + towerSaveRes.body._id)
              .send(tower)
              .expect(200)
              .end(function (towerDeleteErr, towerDeleteRes) {
                // Handle tower error error
                if (towerDeleteErr) {
                  return done(towerDeleteErr);
                }

                // Set assertions
                (towerDeleteRes.body._id).should.equal(towerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single tower if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new tower model instance
    tower.user = user;
    var towerObj = new Tower(tower);

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

        // Save a new tower
        agent.post('/api/towers')
          .send(tower)
          .expect(200)
          .end(function (towerSaveErr, towerSaveRes) {
            // Handle tower save error
            if (towerSaveErr) {
              return done(towerSaveErr);
            }

            // Get the tower
            agent.get('/api/towers/' + towerSaveRes.body._id)
              .expect(200)
              .end(function (towerInfoErr, towerInfoRes) {
                // Handle tower error
                if (towerInfoErr) {
                  return done(towerInfoErr);
                }

                // Set assertions
                (towerInfoRes.body._id).should.equal(towerSaveRes.body._id);
                (towerInfoRes.body.title).should.equal(tower.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (towerInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Tower.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
