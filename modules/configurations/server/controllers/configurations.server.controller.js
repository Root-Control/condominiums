'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Configuration = mongoose.model('Configuration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an configuration
 */

exports.create = function (req, res) {
  var configuration = new Configuration(req.body);

  configuration.user = req.user;
  configuration.condominiumId = req.user.condominium;

  configuration.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};
/**
 * Show the current configuration
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var configuration = req.configuration ? req.configuration.toJSON() : {};

  // Add a custom field to the Configuration, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Configuration model.
  configuration.isCurrentUserOwner = !!(req.user && configuration.user && configuration.user._id.toString() === req.user._id.toString());

  res.json(configuration);
};

/**
 * Update an configuration
 */
exports.update = function (req, res) {
  var configuration = req.configuration;

  configuration.account_number = req.body.account_number;
  configuration.website = req.body.website;
  configuration.condominiumId = req.body.condominiumId;

  configuration.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};

/**
 * Delete an configuration
 */
exports.delete = function (req, res) {
  var configuration = req.configuration;

  configuration.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};

/**
 * List of Configurations
 */
exports.list = function (req, res, promise) {
  return new Promise((resolve, reject) => {
    Configuration.find().sort('-created').populate('user', 'displayName').exec(function (err, configurations) {
      if (err) {
        if (promise === 'Promise') reject(err);
        else return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        if (promise === 'Promise') resolve(configurations);
        else res.json(configurations);
      }
    });
  });
};

/**
 * Configuration middleware
 */
exports.configurationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Configuration is invalid'
    });
  }

  Configuration.findById(id).populate('user', 'displayName').exec(function (err, configuration) {
    if (err) {
      return next(err);
    } else if (!configuration) {
      return res.status(404).send({
        message: 'No configuration with that identifier has been found'
      });
    }
    req.configuration = configuration;
    next();
  });
};
