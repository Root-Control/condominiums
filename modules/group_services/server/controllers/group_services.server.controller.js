'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Group_Service = mongoose.model('Group_Service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an group_service
 */

exports.create = function (req, res) {
  var group_service = new Group_Service(req.body);
  group_service.user = req.user;

  group_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group_service);
    }
  });
};

/**
 * Show the current group_service
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var group_service = req.group_service ? req.group_service.toJSON() : {};

  // Add a custom field to the Group_Service, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Group_Service model.
  group_service.isCurrentUserOwner = !!(req.user && group_service.user && group_service.user._id.toString() === req.user._id.toString());

  res.json(group_service);
};

/**
 * Update an group_service
 */
exports.update = function (req, res) {
  var group_service = req.group_service;

  group_service.title = req.body.title;
  group_service.content = req.body.content;

  group_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group_service);
    }
  });
};

/**
 * Delete an group_service
 */
exports.delete = function (req, res) {
  var group_service = req.group_service;

  group_service.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group_service);
    }
  });
};

/**
 * List of Group_Services
 */
exports.list = function (req, res) {
  Group_Service.find().sort('-created').populate('user', 'displayName').exec(function (err, group_services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group_services);
    }
  });
};

/**
 * Group_Service middleware
 */
exports.group_serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Group_Service is invalid'
    });
  }

  Group_Service.findById(id).populate('user', 'displayName').exec(function (err, group_service) {
    if (err) {
      return next(err);
    } else if (!group_service) {
      return res.status(404).send({
        message: 'No group_service with that identifier has been found'
      });
    }
    req.group_service = group_service;
    next();
  });
};
