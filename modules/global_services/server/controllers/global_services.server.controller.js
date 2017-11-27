'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Global_service = mongoose.model('Global_service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an global_service
 */

exports.create = function (req, res) {
  var global_service = new Global_service(req.body);
  global_service.user = req.user;

  global_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(global_service);
    }
  });
};

/**
 * Show the current global_service
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var global_service = req.global_service ? req.global_service.toJSON() : {};

  // Add a custom field to the Global_service, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Global_service model.
  global_service.isCurrentUserOwner = !!(req.user && global_service.user && global_service.user._id.toString() === req.user._id.toString());

  res.json(global_service);
};

/**
 * Update an global_service
 */
exports.update = function (req, res) {
  var global_service = req.global_service;

  global_service.title = req.body.title;
  global_service.content = req.body.content;

  global_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(global_service);
    }
  });
};

/**
 * Delete an global_service
 */
exports.delete = function (req, res) {
  var global_service = req.global_service;

  global_service.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(global_service);
    }
  });
};

/**
 * List of Global_services
 */
exports.list = function (req, res) {
  Global_service.find().sort('-created').populate('user', 'displayName').exec(function (err, global_services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(global_services);
    }
  });
};

/**
 * Global_service middleware
 */
exports.global_serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Global_service is invalid'
    });
  }

  Global_service.findById(id).populate('user', 'displayName').exec(function (err, global_service) {
    if (err) {
      return next(err);
    } else if (!global_service) {
      return res.status(404).send({
        message: 'No global_service with that identifier has been found'
      });
    }
    req.global_service = global_service;
    next();
  });
};
