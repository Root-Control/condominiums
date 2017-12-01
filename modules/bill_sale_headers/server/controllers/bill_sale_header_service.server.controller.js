'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bill_sale_header = mongoose.model('Bill_sale_header'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bill_sale_header
 */

exports.dumpHeaders = (data, callback) => {
  Bill_sale_header.collection.insert(data, (err, result) => {
    callback();
  });
};

exports.getHeadersByDepartments = async (departments, month) => {
	let headerArray = [];
	return new Promise(async (resolve, reject) => {
		await Bill_sale_header.find({ department: { $in: departments }, month: month }, (err, headers) => {
			for(let i = 0; i< headers.length; i++) {
				headerArray.push(headers[i]._id);
			}
			resolve(headerArray);
		});
	});
};
