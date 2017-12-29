'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bill_sale_header = mongoose.model('Bill_sale_header'),
  Payment = require(path.resolve('./modules/payments/server/controllers/payments.server.controller')),
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

exports.getHeaderIdByDepartmentAndMonth = (departmentId, month, year) => {
	month = parseInt(month, 10);
	if(!year) year = 2017;
	return new Promise(async (resolve, reject) => {
		Bill_sale_header.findOne({ department: departmentId, month: month, year: year }, (err, header) => {
			console.log(header);
			resolve(header);
		});
	});
};

/**
 * Update Header status
 */
exports.updateHeaderStatus = async (req, res) => {
	let paymentBody = {
		billHeader: req.body.billHeader,
		amountPayment: req.body.amountPayment,
		amountPayed: req.body.amountPayed,
		difference: req.body.difference
	};
	let status = req.body.difference > 0 ? 'Parcialmente pagado': 'Pagado';
	let id = req.body.billHeader;
  Bill_sale_header.findOneAndUpdate({ _id: id }, { $set: { status: 'Pagado' } }, { new: false }, async (err, result) => {
    if (err) console.log(err);
    else {
    	await Payment.create(paymentBody);
    	res.json(result);
    }
  });
};

 /**
 * Update Header status
 */