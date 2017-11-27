'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tower_service = mongoose.model('Tower_service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an tower_service
 */

exports.create = function (req, res) {
  var tower_service = new Tower_service(req.body);
  tower_service.user = req.user;

  tower_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tower_service);
    }
  });
};

/**
 * Show the current tower_service
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tower_service = req.tower_service ? req.tower_service.toJSON() : {};

  // Add a custom field to the Tower_service, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Tower_service model.
  tower_service.isCurrentUserOwner = !!(req.user && tower_service.user && tower_service.user._id.toString() === req.user._id.toString());

  res.json(tower_service);
};

/**
 * Update an tower_service
 */
exports.update = function (req, res) {
  var tower_service = req.tower_service;

  tower_service.title = req.body.title;
  tower_service.content = req.body.content;

  tower_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tower_service);
    }
  });
};

/**
 * Delete an tower_service
 */
exports.delete = function (req, res) {
  var tower_service = req.tower_service;

  tower_service.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tower_service);
    }
  });
};

/**
 * List of Tower_services
 */
exports.list = function (req, res) {
  Tower_service.find().sort('-created').populate('user', 'displayName').exec(function (err, tower_services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tower_services);
    }
  });
};

/**
 * Tower_service middleware
 */
exports.tower_serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tower_service is invalid'
    });
  }

  Tower_service.findById(id).populate('user', 'displayName').exec(function (err, tower_service) {
    if (err) {
      return next(err);
    } else if (!tower_service) {
      return res.status(404).send({
        message: 'No tower_service with that identifier has been found'
      });
    }
    req.tower_service = tower_service;
    next();
  });
};
