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
describe('Tower CRUD tests', function () {

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

  it('should not be able to save an tower if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/towers')
          .send(tower)
          .expect(403)
          .end(function (towerSaveErr, towerSaveRes) {
            // Call the assertion callback
            done(towerSaveErr);
          });

      });
  });

  it('should not be able to save an tower if not logged in', function (done) {
    agent.post('/api/towers')
      .send(tower)
      .expect(403)
      .end(function (towerSaveErr, towerSaveRes) {
        // Call the assertion callback
        done(towerSaveErr);
      });
  });

  it('should not be able to update an tower if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/towers')
          .send(tower)
          .expect(403)
          .end(function (towerSaveErr, towerSaveRes) {
            // Call the assertion callback
            done(towerSaveErr);
          });
      });
  });

  it('should be able to get a list of towers if not signed in', function (done) {
    // Create new tower model instance
    var towerObj = new Tower(tower);

    // Save the tower
    towerObj.save(function () {
      // Request towers
      agent.get('/api/towers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single tower if not signed in', function (done) {
    // Create new tower model instance
    var towerObj = new Tower(tower);

    // Save the tower
    towerObj.save(function () {
      agent.get('/api/towers/' + towerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tower.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single tower with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/towers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tower is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single tower which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent tower
    agent.get('/api/towers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No tower with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an tower if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/towers')
          .send(tower)
          .expect(403)
          .end(function (towerSaveErr, towerSaveRes) {
            // Call the assertion callback
            done(towerSaveErr);
          });
      });
  });

  it('should not be able to delete an tower if not signed in', function (done) {
    // Set tower user
    tower.user = user;

    // Create new tower model instance
    var towerObj = new Tower(tower);

    // Save the tower
    towerObj.save(function () {
      // Try deleting tower
      agent.delete('/api/towers/' + towerObj._id)
        .expect(403)
        .end(function (towerDeleteErr, towerDeleteRes) {
          // Set message assertion
          (towerDeleteRes.body.message).should.match('User is not authorized');

          // Handle tower error error
          done(towerDeleteErr);
        });

    });
  });

  it('should be able to get a single tower that has an orphaned user reference', function (done) {
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

          // Save a new tower
          agent.post('/api/towers')
            .send(tower)
            .expect(200)
            .end(function (towerSaveErr, towerSaveRes) {
              // Handle tower save error
              if (towerSaveErr) {
                return done(towerSaveErr);
              }

              // Set assertions on new tower
              (towerSaveRes.body.title).should.equal(tower.title);
              should.exist(towerSaveRes.body.user);
              should.equal(towerSaveRes.body.user._id, orphanId);

              // force the tower to have an orphaned user reference
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
                        should.equal(towerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single tower if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new tower model instance
    var towerObj = new Tower(tower);

    // Save the tower
    towerObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/towers/' + towerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tower.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single tower, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'towerowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Tower
    var _towerOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _towerOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Tower
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

          // Save a new tower
          agent.post('/api/towers')
            .send(tower)
            .expect(200)
            .end(function (towerSaveErr, towerSaveRes) {
              // Handle tower save error
              if (towerSaveErr) {
                return done(towerSaveErr);
              }

              // Set assertions on new tower
              (towerSaveRes.body.title).should.equal(tower.title);
              should.exist(towerSaveRes.body.user);
              should.equal(towerSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (towerInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
