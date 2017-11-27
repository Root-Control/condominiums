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
 * Group Schema
 */
var GroupSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'El nombre no puede ser vacío'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  avgWaterSupply: {
    type: Number,
    required: 'El promedio de costo del agua es obligatorio'
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

GroupSchema.statics.seed = seed;

mongoose.model('Group', GroupSchema);

/**
* Seeds the User collection with document (Group)
* and provided options.
*/
function seed(doc, options) {
  var Group = mongoose.model('Group');

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
        Group
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

            // Remove Group (overwrite)

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
            message: chalk.yellow('Database Seeding: Group\t' + doc.title + ' skipped')
          });
        }

        var group = new Group(doc);

        group.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Group\t' + group.title + ' added'
          });
        });
      });
    }
  });
}
