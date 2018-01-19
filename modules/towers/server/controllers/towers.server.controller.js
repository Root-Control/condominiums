'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tower = mongoose.model('Tower'),
  CustomGroup = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  Supply = require(path.resolve('./modules/supplies/server/controllers/supplies.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an tower
 */
exports.create = function (req, res) {
  var tower = new Tower(req.body);
  var supplies = req.body.supplyCreator;
  delete req.body.supplyCreator;

  tower.user = req.user;
  tower.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Tower.populate(tower, { path: 'groupAssigned' }, async (err, tower) => {
        supplies.forEach(function(key) {
          key.supplyDescription = tower.name;
          key.entityId = tower._id;
          key.type = 3;
          key.active = true;
          key.condominium = tower.groupAssigned.condominium;
        });
        await Supply.bulkSupplies(supplies);
        console.log('Completed');
        res.json(tower);
      });
    }
  });
};

/**
 * Show the current tower
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tower = req.tower ? req.tower.toJSON() : {};

  // Add a custom field to the Tower, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Tower model.
  tower.isCurrentUserOwner = !!(req.user && tower.user && tower.user._id.toString() === req.user._id.toString());

  res.json(tower);
};

/**
 * Update an tower
 */
exports.update = function (req, res) {
  var tower = req.tower;

  tower.name = req.body.name;
  tower.description = req.body.description;
  tower.groupAssigned = req.body.groupAssigned;
  
  var supplies = req.body.supplyCreator;
  delete req.body.supplyCreator;

  tower.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Tower.populate(tower, { path: 'groupAssigned' }, async (err, tower) => {
        supplies.forEach(function(key) {
          key.supplyDescription = tower.name;
          key.entityId = tower._id;
          key.condominium = tower.groupAssigned.condominium;
          key.active = true;
          key.type = 3;
        });
        await Supply.bulkSupplies(supplies);
        console.log('Completed');
        res.json(tower);
      });
    }
  });
};

/**
 * Delete an tower
 */
exports.delete = function (req, res) {
  var tower = req.tower;

  tower.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tower);
    }
  });
};

/**
 * List of Towers
 */
exports.list = async function (req, res) {
  let query = {};
  if (req.query.groupAssigned) query.groupAssigned = req.query.groupAssigned;

  if(req.query.condominiumId) {
    let groups = [];
    let data = await CustomGroup.listGroupsForCondominiumId(req.query.condominiumId, 'promise');
    data.forEach(function(key) {
      groups.push(key._id);
    });
    query = { groupAssigned: { $in: groups } };
  }
  Tower.find(query).sort('-created').populate('user', 'displayName').populate('groupAssigned', 'name').exec(function (err, towers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(towers);
      res.json(towers);
    }
  });
};

/**
 * Tower middleware
 */
exports.towerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tower is invalid'
    });
  }

  Tower.findById(id).populate('user', 'displayName').exec(function (err, tower) {
    if (err) {
      return next(err);
    } else if (!tower) {
      return res.status(404).send({
        message: 'No tower with that identifier has been found'
      });
    }
    req.tower = tower;
    next();
  });
};
