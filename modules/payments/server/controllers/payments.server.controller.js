'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Payment = mongoose.model('Payment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an payment
 */

exports.create = async (data, user) => {
  return new Promise((resolve, reject) => {
    let payment = new Payment(data);
    payment.user = user;

    payment.save(function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};
/**
 * Show the current payment
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var payment = req.payment ? req.payment.toJSON() : {};

  // Add a custom field to the Payment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Payment model.
  payment.isCurrentUserOwner = !!(req.user && payment.user && payment.user._id.toString() === req.user._id.toString());

  res.json(payment);
};

/**
 * Update an payment
 */
exports.update = function (req, res) {
  var payment = req.payment;

  payment.amountPayed = req.body.amountPayed;
  payment.amountPayment = req.body.amountPayment;
  payment.difference = req.body.difference;

  payment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * Delete an payment
 */
exports.delete = function (req, res) {
  var payment = req.payment;

  payment.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * List of Payments
 */
exports.list = function (req, res, promise) {
  return new Promise((resolve, reject) => {
    Payment.find().sort('-created').populate('user', 'displayName').exec(function (err, payments) {
      if (err) {
        if(promise === 'Promise') reject(err);
        else return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        if(promise === 'Promise') resolve(payments);
        else res.json(payments);
      }
    });
  });
};

/**
 * Payment middleware
 */
exports.paymentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Payment is invalid'
    });
  }

  Payment.findById(id).populate('user', 'displayName').exec(function (err, payment) {
    if (err) {
      return next(err);
    } else if (!payment) {
      return res.status(404).send({
        message: 'No payment with that identifier has been found'
      });
    }
    req.payment = payment;
    next();
  });
};


exports.generatePaymentToPdf = async (type, month) => {
  //  Types -> 1.- Global, 2- Grupal, 3.- Torre, 4.- Departamento , 5.- Personal (global)
};