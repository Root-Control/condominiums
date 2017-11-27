'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Condominium = mongoose.model('Condominium'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an condominium
 */
exports.create = function (req, res) {
  var condominium = new Condominium(req.body);
  condominium.user = req.user;

  condominium.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(condominium);
    }
  });
};

/**
 * Show the current condominium
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var condominium = req.condominium ? req.condominium.toJSON() : {};

  // Add a custom field to the Condominium, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Condominium model.
  condominium.isCurrentUserOwner = !!(req.user && condominium.user && condominium.user._id.toString() === req.user._id.toString());

  res.json(condominium);
};

/**
 * Update an condominium
 */
exports.update = function (req, res) {
  var condominium = req.condominium;

  condominium.name = req.body.name;
  condominium.address = req.body.address;

  condominium.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(condominium);
    }
  });
};

/**
 * Delete an condominium
 */
exports.delete = function (req, res) {
  var condominium = req.condominium;

  condominium.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(condominium);
    }
  });
};

/**
 * List of Condominiums
 */
exports.list = function (req, res) {
  Condominium.find().sort('-created').populate('user', 'displayName').exec(function (err, condominiums) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(condominiums);
    }
  });
};

/**
 * Condominium middleware
 */
exports.condominiumByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Condominium is invalid'
    });
  }

  Condominium.findById(id).populate('user', 'displayName').exec(function (err, condominium) {
    if (err) {
      return next(err);
    } else if (!condominium) {
      return res.status(404).send({
        message: 'No condominium with that identifier has been found'
      });
    }
    req.condominium = condominium;
    next();
  });
};
