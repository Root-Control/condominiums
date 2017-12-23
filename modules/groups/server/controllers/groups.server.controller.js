'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  Supply = require(path.resolve('./modules/supplies/server/controllers/supplies.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an group
 */
exports.create = function (req, res) {
  var group = new Group(req.body);
  var supplies = req.body.supplyCreator;
  delete req.body.supplyCreator;

  group.user = req.user;
  group.save(async (err, group) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      supplies.forEach(function(key) {
        key.supplyDescription = group.name;
        key.entityId = group._id;
        key.type = 2;
        key.condominium = group.condominium;
      });
      await Supply.bulkSupplies(supplies);
      console.log('Completed');
      res.json(group);
    }
  });
};

/**
 * Show the current group
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var group = req.group ? req.group.toJSON() : {};

  // Add a custom field to the Group, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Group model.
  group.isCurrentUserOwner = !!(req.user && group.user && group.user._id.toString() === req.user._id.toString());

  res.json(group);
};

/**
 * Update an group
 */
exports.update = function (req, res) {
  var group = req.group;

  group.name = req.body.name;
  group.description = req.body.description;
  group.avgWaterSupply = req.body.avgWaterSupply;

  var supplies = req.body.supplyCreator;
  delete req.body.supplyCreator;

  group.save(async err => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      supplies.forEach(function(key) {
        key.supplyDescription = group.name;
        key.entityId = group._id;
        key.condominium = group.condominium;
        key.type = 2;
      });
      await Supply.bulkSupplies(supplies);
      console.log('Completed');
      res.json(group);
    }
  });
};

/**
 * Delete an group
 */
exports.delete = function (req, res) {
  var group = req.group;

  group.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group);
    }
  });
};

/**
 * List of Groups
 */
exports.list = function (req, res) {
  let query = req.query;
  Group.find(query).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(groups);
    }
  });
};

/**
 * Group middleware
 */
exports.groupByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Group is invalid'
    });
  }

  Group.findById(id).populate('user', 'displayName').exec(function (err, group) {
    if (err) {
      return next(err);
    } else if (!group) {
      return res.status(404).send({
        message: 'No group with that identifier has been found'
      });
    }
    req.group = group;
    next();
  });
};
