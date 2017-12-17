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
 * Agreement Schema
 */
var AgreementSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  clientId: {
    type: Schema.ObjectId,
    ref: 'Client',
    required: 'El cliente es obligatorio'
  },
  departmentId: {
    type: Schema.ObjectId,
    ref: 'Department',
    required: 'El departamento es obligatorio'
  },
  adquisitionDate: {
    type: Date,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

AgreementSchema.statics.seed = seed;

mongoose.model('Agreement', AgreementSchema);

/**
* Seeds the User collection with document (Agreement)
* and provided options.
*/
function seed(doc, options) {
  var Agreement = mongoose.model('Agreement');

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
        Agreement
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

            // Remove Agreement (overwrite)

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
            message: chalk.yellow('Database Seeding: Agreement\t' + doc.title + ' skipped')
          });
        }

        var agreement = new Agreement(doc);

        agreement.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Agreement\t' + agreement.title + ' added'
          });
        });
      });
    }
  });
}
