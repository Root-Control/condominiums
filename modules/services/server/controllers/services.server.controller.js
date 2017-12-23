'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Service = mongoose.model('Service'),
  Supplie =  require(path.resolve('./modules/supplies/server/controllers/supplies.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an service
 */

exports.create = function (req, res) {
  var service = new Service(req.body);
  service.user = req.user;

  service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * Show the current service
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var service = req.service ? req.service.toJSON() : {};

  // Add a custom field to the Service, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Service model.
  service.isCurrentUserOwner = !!(req.user && service.user && service.user._id.toString() === req.user._id.toString());

  res.json(service);
};

/**
 * Update an service
 */
exports.update = function (req, res) {
  var service = req.service;

  service.name = req.body.name;
  service.type = req.body.type;
  service.condominium = req.body.condominium;
  service.globalIdentifier = req.body.globalIdentifier;

  service.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * Delete an service
 */
exports.delete = function (req, res) {
  var service = req.service;

  service.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * get Unregistered Services
 */
exports.getUnregisteredServices = async (req, res) => {
  let entityId = req.body.entityId;
  let type = req.body.type;
  let registered = await Supplie.getRegisteredSuppliesByEntity(entityId);
  let data = {};
  Service.find({ type: type , _id: { "$nin": registered.idServices }, condominium: req.body.condominium }).exec(function (err, services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      data.registered = registered.usedServices;
      data.unregistered = services;
      res.json(data);
    }
  });
};

/**
 * get Unregistered Services
 */


/**
 * List of Services
 */
exports.list = function (req, res) {
  let filter = req.query;
  console.log(filter);
  Service.find(filter).sort('-created').populate('user', 'displayName').exec(function (err, services) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(services);
    }
  });
};

/**
 * Service middleware
 */
exports.serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Service is invalid'
    });
  }

  Service.findById(id).populate('user', 'displayName').exec(function (err, service) {
    if (err) {
      return next(err);
    } else if (!service) {
      return res.status(404).send({
        message: 'No service with that identifier has been found'
      });
    }
    req.service = service;
    next();
  });
};
