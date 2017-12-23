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
 * Supplie Schema
 */
var SupplieSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  supplyCode: {
    type: String,
    default: '',
    trim: true,
    required: 'El identificador de suministro no puede estar vacío'
  },
  supplyDescription: {
    type: String,
    default: '',
    trim: true,
    required: 'Descripcion obligatoria'
  },
  serviceId: {
    type: Schema.ObjectId,
    ref: 'Service'
  },
  entityId: {
    type: Schema.ObjectId,
    ref: ['Condominium', 'Group', 'Tower']
  },
  condominium: {
    type: Schema.ObjectId,
    ref: 'Condominium'
  },
  typeSupply: {
    type: Number
  },
  serviceName: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

SupplieSchema.statics.seed = seed;

mongoose.model('Supplie', SupplieSchema);

/**
* Seeds the User collection with document (Supplie)
* and provided options.
*/
function seed(doc, options) {
  var Supplie = mongoose.model('Supplie');

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
        Supplie
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

            // Remove Supplie (overwrite)

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
            message: chalk.yellow('Database Seeding: Supplie\t' + doc.title + ' skipped')
          });
        }

        var supplie = new Supplie(doc);

        supplie.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Supplie\t' + supplie.title + ' added'
          });
        });
      });
    }
  });
}
