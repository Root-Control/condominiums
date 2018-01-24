'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Key = mongoose.model('Key'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an key
 */

exports.create = function (keys) {
  return new Promise(function (resolve, reject) {
    var key = new Key(keys);
    key.save(function (err) {
      if (err) reject(err);
      else {
        resolve(key);
      }
    });
  });
};

exports.findKeyAndRemove = async id => {
  console.log(id);
  return new Promise((resolve, reject) => {
    Key.findOne({ department: id }).exec(async (err, key) => {
      key.remove(async (err, result) => {
        if(err) reject();
        else resolve();
      });
    }); 
  });
};

exports.getDataDepartmentsByGroup = identifier => {
  let data = {};
  let departments = [];
  return new Promise((resolve, reject) => {
    //  group
    Key.find({ group: identifier, active: true }).exec(function (err, keys) {
      for (let i = 0; i < keys.length; i++) {
        departments.push(keys[i].department);
      }
      data.qty = keys.length;
      data.departments = departments;
      resolve(data);
    });
  });
};

exports.getDataDepartmentsByTower = identifier => {
  let data = {};
  let departments = [];
  //  tower
  return new Promise((resolve, reject) => {
    Key.find({ tower: identifier, active: true }).exec(function (err, keys) {
      for (let i = 0; i < keys.length; i++) {
        departments.push(keys[i].department);
      }
      data.qty = keys.length;
      data.departments = departments;
      resolve(data);
    });
  });
};

exports.getDataDepartmentsByCondominium = identifier => {
  let data = {};
  let departments = [];
  console.log('Promise called');
  //  Condominium
  return new Promise((resolve, reject) => {
    Key.find({ condominium: identifier, active: true }).exec(function (err, keys) {
      for (let i = 0; i < keys.length; i++) {
        departments.push(keys[i].department);
      }
      data.qty = keys.length;
      data.departments = departments;
      resolve(data);
    });
  });
};

exports.getGroupByDepartmentId = identifier => {
  return new Promise((resolve, reject) => {
    Key.findOne({ department: identifier }).populate('department', 'code').populate('condominium', 'name').populate('tower', 'name').populate('group', 'name').exec(function (err, key) {
      if(err) reject(err);
      else resolve(key);
    });
  });
};

exports.updateActiveKeys = async (toweridentifier, status) => {
  return new Promise((resolve, reject) => {
    Key.update({ tower: toweridentifier }, { active: status }, { multi: true, upsert: false }, function(err, result) {
      if(err) reject();
      else resolve();
    });
  });
};

exports.activeDepartments = async() => {
  return new Promise((resolve, reject) => {
    Key.count({ active: true }).exec(function(err, result) {
      resolve({ qty: result });
    });
  });
};
