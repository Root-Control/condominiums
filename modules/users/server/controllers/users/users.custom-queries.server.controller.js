'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.userClientPopulation = async user => {
  return new Promise(async (resolve, reject) => {
    User.populate(user, { path: 'client' }, async (err, user) => {
      if(err) console.log(err);
      else resolve(user);
    });
  });
};

