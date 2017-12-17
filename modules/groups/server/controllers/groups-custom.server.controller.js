'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.listGroupsForCondominiumId = function (req, res) {
  //  Condicion si es una promesa o una ruta
  return new Promise((resolve, reject) => {

    //  Asigno el argumento 1 como promesa
    let isPromise = arguments[1];
    var id = req.body ? req.body.condominiumId : arguments[0];

    Group.find({ condominium: id }).sort('-created').populate('user', 'displayName')
    .populate('condominium', 'name')
    .exec(function (err, groups) {
      if (err) {
        if(isPromise === 'promise') reject(err);
        else {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });        
        }
      } else {
        if(isPromise === 'promise') resolve(groups);
        else res.json(groups);
      }
    });
  });
};

/**
 * searchGroupCondominium
 */
exports.searchGroupCondominium = async groupid => {
  return new Promise(async (resolve, reject) => {
    await Group.findOne({ _id: groupid }).exec(function (err, group) {
      if (err) reject(err);
      else resolve(group);
    });
  });
};

exports.getAvgWaterSupply = async id => {
  return new Promise(async (resolve, reject) => {
    await Group.findOne({ _id: id }).select('avgWaterSupply').exec( async(err, group) => {
      resolve(group.avgWaterSupply);
    });
  });
};
