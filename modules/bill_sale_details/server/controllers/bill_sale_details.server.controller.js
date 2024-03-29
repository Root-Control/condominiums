'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bill_sale_detail = mongoose.model('Bill_sale_detail'),
  Keys = require(path.resolve('./modules/keys/server/controllers/keys.server.controller')),
  Groups = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  Users = require(path.resolve('./modules/users/server/controllers/users/users.custom-queries.server.controller')),
  Agreements = require(path.resolve('./modules/agreements/server/controllers/agreements-custom.server.controller')),
  Configurations = require(path.resolve('./modules/configurations/server/controllers/configurations-custom.server.controller')),
  Bill_header= require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  Consumptions = require(path.resolve('./modules/service_consumptions/server/controllers/service_consumptions.server.controller')),
  AditionalServices = require(path.resolve('./modules/aditionals/server/controllers/aditionals.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bill_sale_detail
 */
exports.getBillPayment = async (req, res) => {
  let user = req.user;
  let totals = [];
  let lastConsume = 0;
  let month = parseInt(req.query.month, 10);
  let year = parseInt(req.query.year, 10);
  let department;
  let departmentId;
  let fullUser = {};
  let contract;
  let due_date = await this.getDueDate(month, year);

  //  No user
  if(user.roles[0] != 'user') {
    contract = await Agreements.getAgreementByDepartment(req.query.departmentId);
    if(contract) fullUser = await Users.getUserByClientId(contract.clientId);
    else fullUser.displayName = 'No asignado';
  }

  //  Caso Admin, si ha elegido un departament Id 
  if(req.query.departmentId) {
    departmentId = req.query.departmentId;
  } else {
    fullUser = await Users.userClientPopulation(req.user);
    department = await Agreements.getDepartmentByAgreement(fullUser.client._id);
    departmentId = department.departmentId._id;
  }
  let header = await Bill_header.getHeaderIdByDepartmentAndMonth(departmentId, month, year);
  let details = await this.getDetailsByHeader(header);

  //  Get AVG WATER AND LAST CONSUME
  let condominiumData = await Keys.getGroupByDepartmentId(departmentId);
  let condominiumDetails = await Configurations.getConfiguration(condominiumData.condominium._id);
  let avgWaterSupply = await Groups.getAvgWaterSupply(condominiumData.group);
  let lastConsumption = await Consumptions.verifyPreviousConsume(departmentId, month);
  if(lastConsumption) lastConsume = lastConsumption.consumed;
  let aditionals = await AditionalServices.getAditionalsByDepartment({ department: departmentId, month: month, year: year });
  //  Get AVG WATER AND LAST CONSUME
  //  Get Condominium information

  let subtotal = 0;
  details.forEach((key) => {
    subtotal = subtotal + key.totalAmount;
  });

  let total = (subtotal + aditionals.totalPenalization) - aditionals.totalDiscount;

  let data = {
    aditionals: aditionals,
    fullUser: fullUser,
    department: department,
    header: header,
    details: details,
    total: total.toFixed(2),
    avgWaterSupply: avgWaterSupply,
    lastConsume: lastConsume,
    informative: condominiumData,
    condominiumDetails: condominiumDetails,
    due_date: due_date
  };
  res.json(data);
};

exports.getTotalsByMonths = async (req, res) => {
  let departmentId;
  let currentYear= (new Date()).getFullYear();
  let totalMonths = [];
  let month = req.query.month;
  let year = req.query.year || parseInt(currentYear, 10);
  let department;
  let fullUser;
  fullUser = await Users.userClientPopulation(req.user);
  department = await Agreements.getDepartmentByAgreement(fullUser.client._id);
  departmentId = department.departmentId._id;

  for(let i = 1; i<13; i++) {
    let aditionals = await AditionalServices.getAditionalsByDepartment({ department: departmentId, month: i, year: year });
    let name = this.getMonthName(i);
    let subtotal = 0;
    let header = await Bill_header.getHeaderIdByDepartmentAndMonth(department.departmentId, i, year);

    let details = await this.getDetailsByHeader(header);
    details.forEach((key) => {
      subtotal = subtotal + key.totalAmount;
    });
    let total = (subtotal + aditionals.totalPenalization) - aditionals.totalDiscount;
    console.log(total);

    totalMonths.push({ month: i, total: total.toFixed(2), status: header.status, name: name });
  }
  res.json(totalMonths);
};

exports.create = function (data, cb) {
  var bill_sale_detail = new Bill_sale_detail(data);
  bill_sale_detail.save(function (err) {
    cb();
  });
};

/**
 * Show the current bill_sale_detail
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bill_sale_detail = req.bill_sale_detail ? req.bill_sale_detail.toJSON() : {};

  // Add a custom field to the Bill_sale_detail, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Bill_sale_detail model.
  bill_sale_detail.isCurrentUserOwner = !!(req.user && bill_sale_detail.user && bill_sale_detail.user._id.toString() === req.user._id.toString());

  res.json(bill_sale_detail);
};

/**
 * Update an bill_sale_detail
 */
exports.update = function (req, res) {
  var bill_sale_detail = req.bill_sale_detail;

  bill_sale_detail.title = req.body.title;
  bill_sale_detail.content = req.body.content;

  bill_sale_detail.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_detail);
    }
  });
};

/**
 * Delete an bill_sale_detail
 */
exports.delete = function (req, res) {
  var bill_sale_detail = req.bill_sale_detail;

  bill_sale_detail.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_detail);
    }
  });
};

/**
 * List of Bill_sale_details
 */
exports.list = function (req, res) {
  Bill_sale_detail.find().sort('-created').populate('user', 'displayName').exec(function (err, bill_sale_details) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_details);
    }
  });
};

exports.getDetailsByHeader = function (headerId) {
  return new Promise((resolve, reject) => {
    Bill_sale_detail.find({ billHeader: headerId }).sort('-created').populate('user', 'displayName').exec(function (err, bill_sale_details) {
      if (err) reject(err);
      else resolve(bill_sale_details);
    });
  });
};

/**
 * Bill_sale_detail middleware
 */
exports.bill_sale_detailByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill_sale_detail is invalid'
    });
  }

  Bill_sale_detail.findById(id).populate('user', 'displayName').exec(function (err, bill_sale_detail) {
    if (err) {
      return next(err);
    } else if (!bill_sale_detail) {
      return res.status(404).send({
        message: 'No bill_sale_detail with that identifier has been found'
      });
    }
    req.bill_sale_detail = bill_sale_detail;
    next();
  });
};

exports.deleteBillDetailTransaction = async id => {
  return new Promise((resolve, reject) => {
    Bill_sale_detail.remove({ transaction_id: id }).exec(async (err, details) => {
      if(err) reject();
      else resolve(details);
    });
  });
};

//  http://18.231.92.119/api/destroy?month=12
exports.destroy2016 = async(req, res) => {
  let Detail = mongoose.model('Bill_sale_detail');
  let month = parseInt(req.query.month, 10);
  let bills = await this.getAllHeaders(month);
  let details = await this.getAllDetails(bills);
  Detail.remove({ _id: { $in: details}}).exec(function(err, result) {
    res.json(result);
  });
};


exports.getAllHeaders = async(month) => {
  let billArray = [];
  return new Promise((resolve, reject) => {
  let Bill = mongoose.model('Bill_sale_header');
    Bill.find({ year: 2016, month: month }).exec(function(err, result) {
      console.log('Se encontraron ' + result.length + ' cabeceras');
      for(var i = 0 ; i<result.length; i++) {
        billArray.push(result[i]._id);
      }
      resolve(billArray);
    });
  });
};

exports.getAllDetails = async(headers) => {
  let details = [];
  return new Promise((resolve, reject) => {
    let Detail = mongoose.model('Bill_sale_detail');
    Detail.find({ billHeader: { $in: headers}}).exec(function(err, result) {
      for(var i = 0 ; i<result.length; i++) {
        details.push(result[i]._id);
      }
      resolve(details);
    });
  });
};

exports.getMonthName = function (month) {
  switch(month) {
    case 1:
      return 'Enero';
      break;
    case 2:
      return 'Febrero';
      break;
    case 3:
      return 'Marzo';
      break;
    case 4:
      return 'Abril';
      break;
    case 5:
      return 'Mayo';
      break;
    case 6:
      return 'Junio';
      break;
    case 7:
      return 'Julio';
      break;
    case 8:
      return 'Agosto';
      break;
    case 9:
      return 'Setiembre';
      break;
    case 10:
      return 'Octubre';
      break;
    case 11:
      return 'Noviembre';
      break;
    case 12:
      return 'Diciembre';
      break;
  }
};

exports.getDueDate = async (month, year) => {
  return new Promise(resolve => {
    let response;
    let day = '05';
    if(month === 12) {
      month =  '01';
      year = year + 1;
      response = `${day}/${month}/${year}`;
    } else {
      month = month + 1;
      if(month.toString().length < 2) {
        month = '0' + month;
      } 
      response = `${day}/${month}/${year}`;
    }
    resolve(response);
  });

};