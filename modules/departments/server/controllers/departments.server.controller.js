'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Department = mongoose.model('Department'),
  CustomDepartment = require(path.resolve('./modules/departments/server/controllers/department-custom.server.controller')),
  Keys = require(path.resolve('./modules/keys/server/controllers/keys.server.controller')),
  Towers = require(path.resolve('./modules/towers/server/controllers/towers-custom-queries.server.controller')),
  Groups = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an department
 */
exports.create = function (req, res) {
  var department = new Department(req.body);
  department.user = req.user;

  department.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Towers.searchTowerGroup(department.tower)
        .then(function (tower) {
          Groups.searchGroupCondominium(tower)
            .then(function (group) {
              let data = {
                department: department._id,
                tower: department.tower,
                group: group._id,
                condominium: group.condominium,
                user: req.user
              };
              Keys.create(data)
                .then(async result =>{
                  await CustomDepartment.createBillHeadersByDepartment(department);
                  res.json(department);
                });
            });
        });
    }
  });
};

/**
 * Show the current department
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var department = req.department ? req.department.toJSON() : {};

  // Add a custom field to the Department, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Department model.
  department.isCurrentUserOwner = !!(req.user && department.user && department.user._id.toString() === req.user._id.toString());

  res.json(department);
};

/**
 * Update an department
 */
exports.update = function (req, res) {
  var department = req.department;
  department.code = req.body.code;
  department.description = req.body.description;
  department.floor = req.body.floor;
  department.tower = req.body.tower;

  department.save(async err =>{
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department);
    }
  });
};

/**
 * Delete an department
 */
exports.delete = function (req, res) {
  var department = req.department;

  department.remove(async err =>{
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      await Keys.findKeyAndRemove(department._id)
      res.json(department);
    }
  });
};

/**
 * List of Departments
 */
exports.list = function (req, res) {
  let query = {};
  if(req.query.tower) query.tower = req.query.tower;
  Department.find(query).sort('-created').populate('user', 'displayName').exec(function (err, departments) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(departments);
    }
  });
};

/**
 * Department middleware
 */
exports.departmentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Department is invalid'
    });
  }

  Department.findById(id).populate('user', 'displayName').exec(function (err, department) {
    if (err) {
      return next(err);
    } else if (!department) {
      return res.status(404).send({
        message: 'No department with that identifier has been found'
      });
    }
    req.department = department;
    next();
  });
};
