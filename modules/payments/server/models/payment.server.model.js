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
 * Payment Schema
 */
var PaymentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  amountPayed: {
    type: Number
  },
  amountPayment: {
    type: Number
  },
  difference: {
    type: Number,
    default: 0
  }, 
  billHeader: {
    type: Schema.ObjectId,
    ref: 'Bill_sale_header'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

PaymentSchema.statics.seed = seed;

mongoose.model('Payment', PaymentSchema);

/**
* Seeds the User collection with document (Payment)
* and provided options.
*/
function seed(doc, options) {
  var Payment = mongoose.model('Payment');

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
        Payment
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

            // Remove Payment (overwrite)

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
            message: chalk.yellow('Database Seeding: Payment\t' + doc.title + ' skipped')
          });
        }

        var payment = new Payment(doc);

        payment.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Payment\t' + payment.title + ' added'
          });
        });
      });
    }
  });
}
