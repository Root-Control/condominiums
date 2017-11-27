'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Department = mongoose.model('Department'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  department;

/**
 * Department routes tests
 */
describe('Department CRUD tests', function () {

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

    // Save a user to the test db and create new department
    user.save()
      .then(function () {
        department = {
          title: 'Department Title',
          content: 'Department Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an department if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/departments')
          .send(department)
          .expect(403)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Call the assertion callback
            done(departmentSaveErr);
          });

      });
  });

  it('should not be able to save an department if not logged in', function (done) {
    agent.post('/api/departments')
      .send(department)
      .expect(403)
      .end(function (departmentSaveErr, departmentSaveRes) {
        // Call the assertion callback
        done(departmentSaveErr);
      });
  });

  it('should not be able to update an department if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/departments')
          .send(department)
          .expect(403)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Call the assertion callback
            done(departmentSaveErr);
          });
      });
  });

  it('should be able to get a list of departments if not signed in', function (done) {
    // Create new department model instance
    var departmentObj = new Department(department);

    // Save the department
    departmentObj.save(function () {
      // Request departments
      agent.get('/api/departments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single department if not signed in', function (done) {
    // Create new department model instance
    var departmentObj = new Department(department);

    // Save the department
    departmentObj.save(function () {
      agent.get('/api/departments/' + departmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', department.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single department with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/departments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Department is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single department which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent department
    agent.get('/api/departments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No department with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an department if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/departments')
          .send(department)
          .expect(403)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Call the assertion callback
            done(departmentSaveErr);
          });
      });
  });

  it('should not be able to delete an department if not signed in', function (done) {
    // Set department user
    department.user = user;

    // Create new department model instance
    var departmentObj = new Department(department);

    // Save the department
    departmentObj.save(function () {
      // Try deleting department
      agent.delete('/api/departments/' + departmentObj._id)
        .expect(403)
        .end(function (departmentDeleteErr, departmentDeleteRes) {
          // Set message assertion
          (departmentDeleteRes.body.message).should.match('User is not authorized');

          // Handle department error error
          done(departmentDeleteErr);
        });

    });
  });

  it('should be able to get a single department that has an orphaned user reference', function (done) {
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

          // Save a new department
          agent.post('/api/departments')
            .send(department)
            .expect(200)
            .end(function (departmentSaveErr, departmentSaveRes) {
              // Handle department save error
              if (departmentSaveErr) {
                return done(departmentSaveErr);
              }

              // Set assertions on new department
              (departmentSaveRes.body.title).should.equal(department.title);
              should.exist(departmentSaveRes.body.user);
              should.equal(departmentSaveRes.body.user._id, orphanId);

              // force the department to have an orphaned user reference
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

                    // Get the department
                    agent.get('/api/departments/' + departmentSaveRes.body._id)
                      .expect(200)
                      .end(function (departmentInfoErr, departmentInfoRes) {
                        // Handle department error
                        if (departmentInfoErr) {
                          return done(departmentInfoErr);
                        }

                        // Set assertions
                        (departmentInfoRes.body._id).should.equal(departmentSaveRes.body._id);
                        (departmentInfoRes.body.title).should.equal(department.title);
                        should.equal(departmentInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single department if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new department model instance
    var departmentObj = new Department(department);

    // Save the department
    departmentObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/departments/' + departmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', department.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single department, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'departmentowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Department
    var _departmentOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _departmentOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Department
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

          // Save a new department
          agent.post('/api/departments')
            .send(department)
            .expect(200)
            .end(function (departmentSaveErr, departmentSaveRes) {
              // Handle department save error
              if (departmentSaveErr) {
                return done(departmentSaveErr);
              }

              // Set assertions on new department
              (departmentSaveRes.body.title).should.equal(department.title);
              should.exist(departmentSaveRes.body.user);
              should.equal(departmentSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the department
                  agent.get('/api/departments/' + departmentSaveRes.body._id)
                    .expect(200)
                    .end(function (departmentInfoErr, departmentInfoRes) {
                      // Handle department error
                      if (departmentInfoErr) {
                        return done(departmentInfoErr);
                      }

                      // Set assertions
                      (departmentInfoRes.body._id).should.equal(departmentSaveRes.body._id);
                      (departmentInfoRes.body.title).should.equal(department.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (departmentInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Department.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
