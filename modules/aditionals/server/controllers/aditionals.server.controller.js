'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Aditional = mongoose.model('Aditional'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an aditional
 */

exports.create = function (req, res) {
  var aditional = new Aditional(req.body);
  aditional.user = req.user;

  aditional.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aditional);
    }
  });
};
/**
 * Show the current aditional
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var aditional = req.aditional ? req.aditional.toJSON() : {};

  // Add a custom field to the Aditional, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Aditional model.
  aditional.isCurrentUserOwner = !!(req.user && aditional.user && aditional.user._id.toString() === req.user._id.toString());

  res.json(aditional);
};

/**
 * Update an aditional
 */
exports.update = function (req, res) {
  var aditional = req.aditional;

  aditional.description = req.body.description;
  aditional.amount = req.body.amount;
  aditional.month = req.body.month;
  aditional.year = req.body.year;
  aditional.type = req.body.type;

  aditional.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aditional);
    }
  });
};

/**
 * Delete an aditional
 */
exports.delete = function (req, res) {
  var aditional = req.aditional;

  aditional.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aditional);
    }
  });
};

/**
 * List of Aditionals
 */
exports.list = function (req, res, promise) {
  return new Promise((resolve, reject) => {
    Aditional.find(req.query).sort('-created').populate('user', 'displayName').populate('department').exec(function (err, aditionals) {
      if (err) {
        if (promise === 'Promise') reject(err);
        else return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        if (promise === 'Promise') resolve(aditionals);
        else res.json(aditionals);
      }
    });
  });
};

/**
 * Aditional middleware
 */
exports.aditionalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Aditional is invalid'
    });
  }

  Aditional.findById(id).populate('user', 'displayName').exec(function (err, aditional) {
    if (err) {
      return next(err);
    } else if (!aditional) {
      return res.status(404).send({
        message: 'No aditional with that identifier has been found'
      });
    }
    req.aditional = aditional;
    next();
  });
};

exports.getAditionalsByDepartment = async data => {
  return new Promise((resolve, reject) => {
    let response = {};
    let totalDiscount = 0;
    let totalPenalization = 0;
    let discount = [];
    let penalization = [];
    let query = {
      department: data.department,
      month: data.month,
      year: data.year
    };
    Aditional.find(query).exec((err, result) => {
      if(err) reject(err);
      else {
        for(let i = 0; i < result.length; i++) {
          if(result[i].type == 1) {
            totalDiscount = totalDiscount + result[i].amount;
            discount.push(result[i]);
          } else {
            totalPenalization = totalPenalization + result[i].amount;
            penalization.push(result[i]);
          }
        }
        response.discount = discount;
        response.penalization = penalization;
        response.totalDiscount = totalDiscount;
        response.totalPenalization = totalPenalization;
        resolve(response);
      }
    });
  });
}