'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Configuration = mongoose.model('Configuration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.getConfiguration = async condominiumId => {
  return new Promise((resolve, reject) => {
    Configuration.findOne({ condominiumId: condominiumId }).exec((err, result) => {
      if(err) reject();
      else {
        if(result) resolve(result);
        else resolve({ account_number: 'No registrado', website: 'No registrado' });
      }
    });
  });
};

