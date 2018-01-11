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
 * Service Schema
 */
var ServiceSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'El nombre del servicio es obligatorio'
  },
  type: {
    type: Number,
    trim: true,
    required: 'El tipo de servicio es requerido'
  },
  active: {
    type: Boolean,
    default: true
  },
  condominium: {
    type: Schema.ObjectId,
    ref: 'Condominium'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ServiceSchema.statics.seed = seed;

mongoose.model('Service', ServiceSchema);

/**
* Seeds the User collection with document (Service)
* and provided options.
*/
function seed(doc, options) {
  var Service = mongoose.model('Service');

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
        Service
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

            // Remove Service (overwrite)

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
            message: chalk.yellow('Database Seeding: Service\t' + doc.title + ' skipped')
          });
        }

        var service = new Service(doc);

        service.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Service\t' + service.title + ' added'
          });
        });
      });
    }
  });
}
