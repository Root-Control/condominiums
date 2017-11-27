'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Department_service = mongoose.model('Department_service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an department_service
 */

exports.create = function (req, res) {
  var department_service = new Department_service(req.body);
  department_service.user = req.user;

  department_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department_service);
    }
  });
};

/**
 * Show the current department_service
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var department_service = req.department_service ? req.department_service.toJSON() : {};

  // Add a custom field to the Department_service, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Department_service model.
  department_service.isCurrentUserOwner = !!(req.user && department_service.user && department_service.user._id.toString() === req.user._id.toString());

  res.json(department_service);
};

/**
 * Update an department_service
 */
exports.update = function (req, res) {
  var department_service = req.department_service;

  department_service.title = req.body.title;
  department_service.content = req.body.content;

  department_service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department_service);
    }
  });
};

/**
 * Delete an department_service
 */
exports.delete = function (req, res) {
  var department_service = req.department_service;

  department_service.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department_service);
    }
  });
};

/**
 * List of Department_services
 */
exports.list = function (req, res) {
  Department_service.find().sort('-created').populate('user', 'displayName').exec(function (err, department_services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department_services);
    }
  });
};

/**
 * Department_service middleware
 */
exports.department_serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Department_service is invalid'
    });
  }

  Department_service.findById(id).populate('user', 'displayName').exec(function (err, department_service) {
    if (err) {
      return next(err);
    } else if (!department_service) {
      return res.status(404).send({
        message: 'No department_service with that identifier has been found'
      });
    }
    req.department_service = department_service;
    next();
  });
};
