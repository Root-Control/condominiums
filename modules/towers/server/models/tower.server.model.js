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
 * Tower Schema
 */
var TowerSchema = new Schema({
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
  departments_max_qty: {
    type: Number,
    required: 'La cantidad máxima de departamentos es obligatoria'
  },
  description: {
    type: String,
    required: 'Escribe una breve descripción'
  },
  groupAssigned: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

TowerSchema.statics.seed = seed;

mongoose.model('Tower', TowerSchema);

/**
* Seeds the User collection with document (Tower)
* and provided options.
*/
function seed(doc, options) {
  var Tower = mongoose.model('Tower');

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
        Tower
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

            // Remove Tower (overwrite)

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
            message: chalk.yellow('Database Seeding: Tower\t' + doc.title + ' skipped')
          });
        }

        var tower = new Tower(doc);

        tower.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Tower\t' + tower.title + ' added'
          });
        });
      });
    }
  });
}
