'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Department Schema
 */
var DepartmentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String,
    default: '',
    trim: true,
    required: 'El código del departamento es obligatorio'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  floor: {
    type: String,
    default: '',
    trim: true
  },
  tower: {
    type: Schema.ObjectId,
    ref: 'Tower'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

DepartmentSchema.statics.seed = seed;

mongoose.model('Department', DepartmentSchema);

/**
* Seeds the User collection with document (Department)
* and provided options.
*/
function seed(doc, options) {
  var Department = mongoose.model('Department');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin', 'superadmin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Department
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Department (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Department\t' + doc.title + ' skipped')
          });
        }

        var department = new Department(doc);

        department.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Department\t' + department.title + ' added'
          });
        });
      });
    }
  });
}
