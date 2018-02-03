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
 * Aditional Schema
 */
var AditionalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  amount: {
    type: Number,
    default: 0
  },
  month: {
    type: Number
  },
  year: {
    type: Number
  },
  department: {
    type: Schema.ObjectId,
    ref: 'Department'
  },
  type: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

AditionalSchema.statics.seed = seed;

mongoose.model('Aditional', AditionalSchema);

/**
* Seeds the User collection with document (Aditional)
* and provided options.
*/
function seed(doc, options) {
  var Aditional = mongoose.model('Aditional');

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
            roles: { $in: ['admin', 'superadmin', 'c-admin'] }
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
        Aditional
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

            // Remove Aditional (overwrite)

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
            message: chalk.yellow('Database Seeding: Aditional\t' + doc.title + ' skipped')
          });
        }

        var aditional = new Aditional(doc);

        aditional.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Aditional\t' + aditional.title + ' added'
          });
        });
      });
    }
  });
}
