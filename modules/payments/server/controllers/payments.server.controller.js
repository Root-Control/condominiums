'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Payment = mongoose.model('Payment'),
  BillDetails = require(path.resolve('./modules/bill_sale_details/server/controllers/bill_sale_details.server.controller')),
  Department = require(path.resolve('./modules/departments/server/controllers/department-custom.server.controller')),
  Agreement = require(path.resolve('./modules/agreements/server/controllers/agreements-custom.server.controller')),
  BillHeader = require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an payment
 */

exports.create = async (data, user) => {
  return new Promise((resolve, reject) => {
    let payment = new Payment(data);
    payment.user = user;

    payment.save(function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};
/**
 * Show the current payment
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var payment = req.payment ? req.payment.toJSON() : {};

  // Add a custom field to the Payment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Payment model.
  payment.isCurrentUserOwner = !!(req.user && payment.user && payment.user._id.toString() === req.user._id.toString());

  res.json(payment);
};

/**
 * Update an payment
 */
exports.update = function (req, res) {
  var payment = req.payment;

  payment.amountPayed = req.body.amountPayed;
  payment.amountPayment = req.body.amountPayment;
  payment.difference = req.body.difference;

  payment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * Delete an payment
 */
exports.delete = function (req, res) {
  var payment = req.payment;

  payment.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * List of Payments
 */
exports.list = function (req, res, promise) {
  return new Promise((resolve, reject) => {
    Payment.find().sort('-created').populate('user', 'displayName').exec(function (err, payments) {
      if (err) {
        if(promise === 'Promise') reject(err);
        else return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        if(promise === 'Promise') resolve(payments);
        else res.json(payments);
      }
    });
  });
};

/**
 * Payment middleware
 */
exports.paymentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Payment is invalid'
    });
  }

  Payment.findById(id).populate('user', 'displayName').exec(function (err, payment) {
    if (err) {
      return next(err);
    } else if (!payment) {
      return res.status(404).send({
        message: 'No payment with that identifier has been found'
      });
    }
    req.payment = payment;
    next();
  });
};

exports.requestPaymentData = async (req, res) => {
  let options = {};
  let departmentData = {};
  let current_month = '';
  let status = 'Pending';
  let today = moment().format('M');
  let responseData = [];
  let fullName = '';
  let towerName = '';
  let totalAmount = 0;

  let arrayDepartments = await Department.getDepartmentsByCodeRegex(req.query.code);
  if(!req.query.allmonths) {
    let last_period = setYearAndMonth(today);
    options.month = last_period.month;
    options.year = last_period.year;
  }

  if(req.query.status) options.status = req.query.status;
  
  for(let i = 0; i < arrayDepartments.length; i++) {
    //  Iteramos en todos los depas

    //  Obtenemos el nombre del departamento
    let departmentCode = arrayDepartments[i].code;

    //  Obtenemos el nombre d ela torre
    let towerName = arrayDepartments[i].tower.name;

    //  Obtenemos la cabecera o el grupo de boletas de el departamento
    let headers = await BillHeader.getCustomHeadersByDepartments(arrayDepartments[i]._id, options);

    let agreements = await Agreement.getAgreementByDepartment(arrayDepartments[i]._id);
    if(agreements) fullName = agreements.clientId.name + ' ' + agreements.clientId.lastName;
    else fullName = 'No existe contrato';

    for(let i = 0; i < headers.length; i ++) {
      let details = await BillDetails.getDetailsByHeader(headers[i]._id);

      for(let x = 0; x < details.length; x++) {
        totalAmount = totalAmount + details[x].totalAmount;
      }

      departmentData.headerId = headers[i]._id;
      departmentData.month = BillDetails.getMonthName(headers[i].month);
      departmentData.total = totalAmount.toFixed(2);
      departmentData.name = departmentCode;
      departmentData.tower = towerName;
      departmentData.client = fullName;
      departmentData.status = headers[i].status;
      departmentData.paymentOwner = headers[i].paymentOwner;

      responseData.push(departmentData);
      departmentData = {};
      totalAmount = 0;
    }
  }
  //console.log(responseData);
  //  Get Client By Department, 
  res.json(responseData);
};

exports.generatePaymentToPdf = async (type, month) => {
  //  Types -> 1.- Global, 2- Grupal, 3.- Torre, 4.- Departamento , 5.- Personal (global)
};

function setYearAndMonth(month) {
  let last_month;
  let last_year;
  let current_year= moment().format('Y');

  if(parseInt(month, 10) === 1) {
    last_month = 12;
    last_year = current_year - 1;
  } else {
    last_month = parseInt(month, 10) - 1;
    last_year = current_year;
  }
  return { month: last_month, year: last_year };
}