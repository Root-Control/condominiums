'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Client = mongoose.model('Client'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  client;

/**
 * Client routes tests
 */
describe('Client CRUD tests', function () {

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

    // Save a user to the test db and create new client
    user.save()
      .then(function () {
        client = {
          title: 'Client Title',
          content: 'Client Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an client if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/clients')
          .send(client)
          .expect(403)
          .end(function (clientSaveErr, clientSaveRes) {
            // Call the assertion callback
            done(clientSaveErr);
          });

      });
  });

  it('should not be able to save an client if not logged in', function (done) {
    agent.post('/api/clients')
      .send(client)
      .expect(403)
      .end(function (clientSaveErr, clientSaveRes) {
        // Call the assertion callback
        done(clientSaveErr);
      });
  });

  it('should not be able to update an client if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/clients')
          .send(client)
          .expect(403)
          .end(function (clientSaveErr, clientSaveRes) {
            // Call the assertion callback
            done(clientSaveErr);
          });
      });
  });

  it('should be able to get a list of clients if not signed in', function (done) {
    // Create new client model instance
    var clientObj = new Client(client);

    // Save the client
    clientObj.save(function () {
      // Request clients
      agent.get('/api/clients')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single client if not signed in', function (done) {
    // Create new client model instance
    var clientObj = new Client(client);

    // Save the client
    clientObj.save(function () {
      agent.get('/api/clients/' + clientObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', client.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single client with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/clients/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Client is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single client which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent client
    agent.get('/api/clients/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No client with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an client if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/clients')
          .send(client)
          .expect(403)
          .end(function (clientSaveErr, clientSaveRes) {
            // Call the assertion callback
            done(clientSaveErr);
          });
      });
  });

  it('should not be able to delete an client if not signed in', function (done) {
    // Set client user
    client.user = user;

    // Create new client model instance
    var clientObj = new Client(client);

    // Save the client
    clientObj.save(function () {
      // Try deleting client
      agent.delete('/api/clients/' + clientObj._id)
        .expect(403)
        .end(function (clientDeleteErr, clientDeleteRes) {
          // Set message assertion
          (clientDeleteRes.body.message).should.match('User is not authorized');

          // Handle client error error
          done(clientDeleteErr);
        });

    });
  });

  it('should be able to get a single client that has an orphaned user reference', function (done) {
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

          // Save a new client
          agent.post('/api/clients')
            .send(client)
            .expect(200)
            .end(function (clientSaveErr, clientSaveRes) {
              // Handle client save error
              if (clientSaveErr) {
                return done(clientSaveErr);
              }

              // Set assertions on new client
              (clientSaveRes.body.title).should.equal(client.title);
              should.exist(clientSaveRes.body.user);
              should.equal(clientSaveRes.body.user._id, orphanId);

              // force the client to have an orphaned user reference
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

                    // Get the client
                    agent.get('/api/clients/' + clientSaveRes.body._id)
                      .expect(200)
                      .end(function (clientInfoErr, clientInfoRes) {
                        // Handle client error
                        if (clientInfoErr) {
                          return done(clientInfoErr);
                        }

                        // Set assertions
                        (clientInfoRes.body._id).should.equal(clientSaveRes.body._id);
                        (clientInfoRes.body.title).should.equal(client.title);
                        should.equal(clientInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single client if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new client model instance
    var clientObj = new Client(client);

    // Save the client
    clientObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/clients/' + clientObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', client.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single client, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'clientowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Client
    var _clientOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _clientOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Client
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

          // Save a new client
          agent.post('/api/clients')
            .send(client)
            .expect(200)
            .end(function (clientSaveErr, clientSaveRes) {
              // Handle client save error
              if (clientSaveErr) {
                return done(clientSaveErr);
              }

              // Set assertions on new client
              (clientSaveRes.body.title).should.equal(client.title);
              should.exist(clientSaveRes.body.user);
              should.equal(clientSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the client
                  agent.get('/api/clients/' + clientSaveRes.body._id)
                    .expect(200)
                    .end(function (clientInfoErr, clientInfoRes) {
                      // Handle client error
                      if (clientInfoErr) {
                        return done(clientInfoErr);
                      }

                      // Set assertions
                      (clientInfoRes.body._id).should.equal(clientSaveRes.body._id);
                      (clientInfoRes.body.title).should.equal(client.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (clientInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Client.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
