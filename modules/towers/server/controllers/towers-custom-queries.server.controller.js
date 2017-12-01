'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tower = mongoose.model('Tower'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an department
 */
exports.searchTowerGroup = function (towerid) {
  return new Promise(function (resolve, reject) {
    Tower.findOne({ _id: towerid }).exec(function (err, tower) {
      if (err) reject(err);
      else resolve(tower.groupAssigned);
    });
  });
};
