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

exports.getHeadersByDepartments = async (departments, month, year) => {
	if(!year) year = 2018;
	let headerArray = [];
	return new Promise(async (resolve, reject) => {
		await Bill_sale_header.find({ department: { $in: departments }, month: month, year: year }, (err, headers) => {
			for(let i = 0; i< headers.length; i++) {
				headerArray.push(headers[i]._id);
			}
			resolve(headerArray);
		});
	});
};

exports.getHeaderIdByDepartmentAndMonth = (departmentId, month, year) => {
	month = parseInt(month, 10);
	if(!year) year = 2018;
	return new Promise(async (resolve, reject) => {
		Bill_sale_header.findOne({ department: departmentId, month: month, year: year }, (err, header) => {
			resolve(header);
		});
	});
};

exports.getCustomHeadersByDepartments = (departmentId, options) => {
	return new Promise((resolve, reject) => {
	options.department = departmentId;
		Bill_sale_header.find(options, (err, headers) => {
			if(err) reject(err);
			else resolve(headers);
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
		difference: req.body.difference,
		transactionNumber: req.body.transactionNumber
	};
	let paymentOwner = req.body.paymentOwner;
	let status = req.body.difference > 0 ? 'Refinanciamiento': 'Pagado';
	let id = req.body.billHeader;
  Bill_sale_header.findOneAndUpdate({ _id: id }, { $set: { status: status, paymentOwner: paymentOwner } }, { new: false }, async (err, result) => {
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


 exports.getBillByMonthAndYear = (month, year, options) => {
  	let headers;
 	return new Promise(async (resolve, reject) => {
 		if(options = {} || !options) headers = await this.getAllBills(month, year);
 		if(options.towerId) headers = await this.getAllBillsByTowerId(month, year, towerId);
 		if(options.groupId) headers = await this.getAllBillsByGroupId(month, year, groupId);
 		if(options.departamentId) headers = await this.getBillByDepartmentId(month, year, departmentId);
 		resolve(headers);
 	});

 	//	Casos
 	//	Si solo elige descargar, se descarga todo
 	//	Si elige descargar por torre
 	//	Si elige descargar por grupo
 	//	Si elige por un grupo en específico
 	//	Si elige por una torre en específica
 	//	Si elige por un departamento en específico
 }


 exports.getAllBills = (month, year) => {
 	return new Promise( async (resolve, reject) => {
	  	Bill_sale_header.find({ month: month, year: year }, async(err, result) => {
	  		if(err) reject(err);
	  		else resolve(result);
	 	});		
	  })
 };

 exports.getAllBillsByGroupId = async (month, year, groupId) => {
 	//	Obtener el grupo y buscar todas sus torres
 	//	De todas las torres buscar todos los departamentos
 	//	De todos los departamentos buscar sus cabeceras por mes y año
 };

 exports.getAllBillsByTowerId = async (month, year, towerId) => {
 	//	De la torre buscar todos sus departamentos
 	//	De todos los departamentos buscar sus cabeceras por mes y año
 };

 exports.getBillByDepartmentId = async (month, year, departmentId) => {
 	//	Del departamento buscar su cabecera por mes y año
 };