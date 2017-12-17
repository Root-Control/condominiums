'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  validator = require('validator'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * Client Schema
 */
var ClientSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'El nombre es obligatorio'
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
    required: 'El apellido es obligatorio'
  },
  birthDate: {
    type: Date,
    required: 'La fecha de nacimiento es obligatoria'
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  cellphone: {
    type: String,
    default: ''
  },
  document: {
    type: String,
    required: 'El número de documento es obligatorio'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ClientSchema.statics.seed = seed;

mongoose.model('Client', ClientSchema);

/**
* Seeds the User collection with document (Client)
* and provided options.
*/
function seed(doc, options) {
  var Client = mongoose.model('Client');

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
        Client
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

            // Remove Client (overwrite)

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
            message: chalk.yellow('Database Seeding: Client\t' + doc.title + ' skipped')
          });
        }

        var client = new Client(doc);

        client.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Client\t' + client.title + ' added'
          });
        });
      });
    }
  });
}
