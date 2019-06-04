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
 * Service_consumption Schema
 */
var Service_consumptionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  globalIdentifier: {
    type: Schema.ObjectId,
    required: 'Es requerido el identificador'
  },
  serviceName: {
    type: String
  },
  supplyCode: {
    type: String
  },
  month: {
    type: Number
  },
  year: {
    type: Number,
    default: 2019
  },
  service: {
    type: Schema.ObjectId,
    ref: 'Service'
  },
  total: {
    type: Number
  },
  type: {
    type: Number
  },
  consumed: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

Service_consumptionSchema.statics.seed = seed;

mongoose.model('Service_consumption', Service_consumptionSchema);

/**
* Seeds the User collection with document (Service_consumption)
* and provided options.
*/
function seed(doc, options) {
  var Service_consumption = mongoose.model('Service_consumption');

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
        Service_consumption
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

            // Remove Service_consumption (overwrite)

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
            message: chalk.yellow('Database Seeding: Service_consumption\t' + doc.title + ' skipped')
          });
        }

        var service_consumption = new Service_consumption(doc);

        service_consumption.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Service_consumption\t' + service_consumption.title + ' added'
          });
        });
      });
    }
  });
}
