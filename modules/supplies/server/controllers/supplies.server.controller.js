'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Supplie = mongoose.model('Supplie'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an supplie
 */

exports.create = function (req, res) {
  var supplie = new Supplie(req.body);
  supplie.user = req.user;

  supplie.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supplie);
    }
  });
};

exports.bulkSupplies = function (supplies) {
  console.log(supplies);
  return new Promise(function(resolve, reject) {
    Supplie.collection.insert(supplies, (err, result) => {
      console.log(result);
      resolve();
    });
  });
};

/**
 * Get Current Registered supplies
 */

exports.getRegisteredSuppliesByEntity = async entity => {
  let ids = [];
  let data = {};
  return new Promise((resolve, reject) => {
    Supplie.find({ entityId: entity }).exec(function (err, supplies) {
      supplies.forEach(function(key) {
        ids.push(key.serviceId);
      });
      data.usedServices = supplies;
      data.idServices = ids;
      resolve(data);
    });
  });
};
 /**
 * Get Current Registered supplies
 */


/**
 * Show the current supplie
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var supplie = req.supplie ? req.supplie.toJSON() : {};

  // Add a custom field to the Supplie, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Supplie model.
  supplie.isCurrentUserOwner = !!(req.user && supplie.user && supplie.user._id.toString() === req.user._id.toString());

  res.json(supplie);
};

/**
 * Update an supplie
 */
exports.update = function (req, res) {
  var supplie = req.supplie;

  supplie.supplyCode = req.body.supplyCode;
  supplie.serviceId = req.body.serviceId;
  supplie.entityId = req.body.entityId;
  supplie.typeSupply = req.body.typeSupply;

  supplie.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supplie);
    }
  });
};

/**
 * Delete an supplie
 */
exports.delete = function (req, res) {
  var supplie = req.supplie;

  supplie.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supplie);
    }
  });
};

/**
 * List of Supplies
 */
exports.list = function (req, res) { 
  let query = {};
  if (req.query.type) query.type = parseInt(req.query.type, 10);
    Supplie.find(query).sort('-created').populate('user', 'displayName').exec(function (err, supplies) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supplies);
    }
  });
};

/**
 * Supplie middleware
 */
exports.supplieByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Supplie is invalid'
    });
  }

  Supplie.findById(id).populate('user', 'displayName').exec(function (err, supplie) {
    if (err) {
      return next(err);
    } else if (!supplie) {
      return res.status(404).send({
        message: 'No supplie with that identifier has been found'
      });
    }
    req.supplie = supplie;
    next();
  });
};
