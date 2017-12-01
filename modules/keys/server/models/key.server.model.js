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
 * Key Schema
 */
var KeySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  department: {
    type: Schema.ObjectId,
    ref: 'Department'
  },
  tower: {
    type: Schema.ObjectId,
    ref: 'Tower'
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group'
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

KeySchema.statics.seed = seed;

mongoose.model('Key', KeySchema);

/**
* Seeds the User collection with document (Key)
* and provided options.
*/
function seed(doc, options) {
  var Key = mongoose.model('Key');

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
        Key
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

            // Remove Key (overwrite)

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
            message: chalk.yellow('Database Seeding: Key\t' + doc.title + ' skipped')
          });
        }

        var key = new Key(doc);

        key.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Key\t' + key.title + ' added'
          });
        });
      });
    }
  });
}
