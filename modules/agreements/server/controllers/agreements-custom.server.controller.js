'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Agreement = mongoose.model('Agreement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an agreement
 */

exports.getDepartmentByAgreement = function (clientId) {
  let id = mongoose.Types.ObjectId(clientId);
  return new Promise(async (resolve, reject) => {
    Agreement.findOne({ clientId: id }).sort('-created').populate('user', 'displayName').populate('departmentId').exec(function (err, agreements) {
      if (err) reject(err);
      else resolve(agreements);
    });
  })
};

exports.getUserContract = function (req, res) {
  let id = mongoose.Types.ObjectId(req.user.client);
  Agreement.find({ clientId: id }).exec(function(err, agreements) {
    if(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });      
    } else {
      if(agreements.length > 0)       res.json({ exists: true });
      else res.json({ exists: false });
    }
  });
};

exports.getAgreementByDepartment = departmentId => {
  return new Promise((resolve, reject) => {
    Agreement.findOne({ departmentId: departmentId }).populate('clientId').exec(function(err, result) {
      if(err) reject(err);
      else resolve(result);
    });
  });
};
