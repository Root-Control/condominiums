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
describe('Condominium CRUD tests', function () {

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
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new condominium
    user.save()
      .then(function () {
        condominium = {
          title: 'Condominium Name',
          content: 'Condominium Address'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an condominium if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/condominiums')
          .send(condominium)
          .expect(403)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Call the assertion callback
            done(condominiumSaveErr);
          });

      });
  });

  it('should not be able to save an condominium if not logged in', function (done) {
    agent.post('/api/condominiums')
      .send(condominium)
      .expect(403)
      .end(function (condominiumSaveErr, condominiumSaveRes) {
        // Call the assertion callback
        done(condominiumSaveErr);
      });
  });

  it('should not be able to update an condominium if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/condominiums')
          .send(condominium)
          .expect(403)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Call the assertion callback
            done(condominiumSaveErr);
          });
      });
  });

  it('should be able to get a list of condominiums if not signed in', function (done) {
    // Create new condominium model instance
    var condominiumObj = new Condominium(condominium);

    // Save the condominium
    condominiumObj.save(function () {
      // Request condominiums
      agent.get('/api/condominiums')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single condominium if not signed in', function (done) {
    // Create new condominium model instance
    var condominiumObj = new Condominium(condominium);

    // Save the condominium
    condominiumObj.save(function () {
      agent.get('/api/condominiums/' + condominiumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', condominium.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single condominium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/condominiums/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Condominium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single condominium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent condominium
    agent.get('/api/condominiums/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No condominium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an condominium if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/condominiums')
          .send(condominium)
          .expect(403)
          .end(function (condominiumSaveErr, condominiumSaveRes) {
            // Call the assertion callback
            done(condominiumSaveErr);
          });
      });
  });

  it('should not be able to delete an condominium if not signed in', function (done) {
    // Set condominium user
    condominium.user = user;

    // Create new condominium model instance
    var condominiumObj = new Condominium(condominium);

    // Save the condominium
    condominiumObj.save(function () {
      // Try deleting condominium
      agent.delete('/api/condominiums/' + condominiumObj._id)
        .expect(403)
        .end(function (condominiumDeleteErr, condominiumDeleteRes) {
          // Set message assertion
          (condominiumDeleteRes.body.message).should.match('User is not authorized');

          // Handle condominium error error
          done(condominiumDeleteErr);
        });

    });
  });

  it('should be able to get a single condominium that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new condominium
          agent.post('/api/condominiums')
            .send(condominium)
            .expect(200)
            .end(function (condominiumSaveErr, condominiumSaveRes) {
              // Handle condominium save error
              if (condominiumSaveErr) {
                return done(condominiumSaveErr);
              }

              // Set assertions on new condominium
              (condominiumSaveRes.body.title).should.equal(condominium.title);
              should.exist(condominiumSaveRes.body.user);
              should.equal(condominiumSaveRes.body.user._id, orphanId);

              // force the condominium to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(condominiumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single condominium if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new condominium model instance
    var condominiumObj = new Condominium(condominium);

    // Save the condominium
    condominiumObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/condominiums/' + condominiumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', condominium.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single condominium, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'condominiumowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Condominium
    var _condominiumOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _condominiumOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Condominium
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new condominium
          agent.post('/api/condominiums')
            .send(condominium)
            .expect(200)
            .end(function (condominiumSaveErr, condominiumSaveRes) {
              // Handle condominium save error
              if (condominiumSaveErr) {
                return done(condominiumSaveErr);
              }

              // Set assertions on new condominium
              (condominiumSaveRes.body.title).should.equal(condominium.title);
              should.exist(condominiumSaveRes.body.user);
              should.equal(condominiumSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (condominiumInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
