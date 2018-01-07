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
 * Configuration Schema
 */
var ConfigurationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  account_number: {
    type: String,
    default: '',
    trim: true,
    required: 'La cuenta a abonar es obligatoria'
  },
  website: {
    type: String,
    default: '',
    trim: true
  },
  condominiumId: {
    type: Schema.ObjectId,
    ref: 'Condominium'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ConfigurationSchema.statics.seed = seed;

mongoose.model('Configuration', ConfigurationSchema);

/**
* Seeds the User collection with document (Configuration)
* and provided options.
*/
function seed(doc, options) {
  var Configuration = mongoose.model('Configuration');

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
        Configuration
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

            // Remove Configuration (overwrite)

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
            message: chalk.yellow('Database Seeding: Configuration\t' + doc.title + ' skipped')
          });
        }

        var configuration = new Configuration(doc);

        configuration.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Configuration\t' + configuration.title + ' added'
          });
        });
      });
    }
  });
}
