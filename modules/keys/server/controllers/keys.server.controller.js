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

exports.getDataDepartmentsByGroup = identifier => {
  let data = {};
  let departments = [];
  return new Promise((resolve, reject) => {
    //  group
    Key.find({ group: identifier }).exec(function (err, keys) {
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
    Key.find({ tower: identifier }).exec(function (err, keys) {
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
    Key.find({ condominium: identifier }).exec(function (err, keys) {
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
    Key.findOne({ department: identifier }).exec(function (err, key) {
      if(err) reject(err);
      else resolve(key);
    });
  });
};