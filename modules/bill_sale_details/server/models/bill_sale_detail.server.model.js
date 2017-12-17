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
 * Bill_sale_detail Schema
 */
var Bill_sale_detailSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  serviceName: {
    type: String,
    default: '',
    trim: true
  },
  supplyCode: {
    type: String
  },
  amount: {
    type: Number
  },
  qtyDivision: {
    type: Number
  },
  totalAmount: {
    type: Number
  },
  comment: {
    type: String
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

Bill_sale_detailSchema.statics.seed = seed;

mongoose.model('Bill_sale_detail', Bill_sale_detailSchema);

/**
* Seeds the User collection with document (Bill_sale_detail)
* and provided options.
*/
function seed(doc, options) {
  var Bill_sale_detail = mongoose.model('Bill_sale_detail');

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
        Bill_sale_detail
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

            // Remove Bill_sale_detail (overwrite)

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
            message: chalk.yellow('Database Seeding: Bill_sale_detail\t' + doc.title + ' skipped')
          });
        }

        var bill_sale_detail = new Bill_sale_detail(doc);

        bill_sale_detail.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Bill_sale_detail\t' + bill_sale_detail.title + ' added'
          });
        });
      });
    }
  });
}
