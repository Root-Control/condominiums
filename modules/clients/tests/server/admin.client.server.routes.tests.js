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
describe('Client Admin CRUD tests', function () {
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

  it('should be able to save an client if logged in', function (done) {
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

        // Save a new client
        agent.post('/api/clients')
          .send(client)
          .expect(200)
          .end(function (clientSaveErr, clientSaveRes) {
            // Handle client save error
            if (clientSaveErr) {
              return done(clientSaveErr);
            }

            // Get a list of clients
            agent.get('/api/clients')
              .end(function (clientsGetErr, clientsGetRes) {
                // Handle client save error
                if (clientsGetErr) {
                  return done(clientsGetErr);
                }

                // Get clients list
                var clients = clientsGetRes.body;

                // Set assertions
                (clients[0].user._id).should.equal(userId);
                (clients[0].title).should.match('Client Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an client if signed in', function (done) {
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

        // Save a new client
        agent.post('/api/clients')
          .send(client)
          .expect(200)
          .end(function (clientSaveErr, clientSaveRes) {
            // Handle client save error
            if (clientSaveErr) {
              return done(clientSaveErr);
            }

            // Update client title
            client.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing client
            agent.put('/api/clients/' + clientSaveRes.body._id)
              .send(client)
              .expect(200)
              .end(function (clientUpdateErr, clientUpdateRes) {
                // Handle client update error
                if (clientUpdateErr) {
                  return done(clientUpdateErr);
                }

                // Set assertions
                (clientUpdateRes.body._id).should.equal(clientSaveRes.body._id);
                (clientUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an client if no title is provided', function (done) {
    // Invalidate title field
    client.title = '';

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

        // Save a new client
        agent.post('/api/clients')
          .send(client)
          .expect(422)
          .end(function (clientSaveErr, clientSaveRes) {
            // Set message assertion
            (clientSaveRes.body.message).should.match('Title cannot be blank');

            // Handle client save error
            done(clientSaveErr);
          });
      });
  });

  it('should be able to delete an client if signed in', function (done) {
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

        // Save a new client
        agent.post('/api/clients')
          .send(client)
          .expect(200)
          .end(function (clientSaveErr, clientSaveRes) {
            // Handle client save error
            if (clientSaveErr) {
              return done(clientSaveErr);
            }

            // Delete an existing client
            agent.delete('/api/clients/' + clientSaveRes.body._id)
              .send(client)
              .expect(200)
              .end(function (clientDeleteErr, clientDeleteRes) {
                // Handle client error error
                if (clientDeleteErr) {
                  return done(clientDeleteErr);
                }

                // Set assertions
                (clientDeleteRes.body._id).should.equal(clientSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single client if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new client model instance
    client.user = user;
    var clientObj = new Client(client);

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

        // Save a new client
        agent.post('/api/clients')
          .send(client)
          .expect(200)
          .end(function (clientSaveErr, clientSaveRes) {
            // Handle client save error
            if (clientSaveErr) {
              return done(clientSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (clientInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
