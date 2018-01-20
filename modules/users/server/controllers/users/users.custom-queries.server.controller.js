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

exports.validateAvailableUser = async data => {
	return new Promise((resolve, reject) => {
		User.find( { $or:[ { 'username': data.username }, { 'email': data.email }]}, function(err, users) {
			if(users.length > 0) resolve(true);
			else resolve(false);
		});
	});
 };

