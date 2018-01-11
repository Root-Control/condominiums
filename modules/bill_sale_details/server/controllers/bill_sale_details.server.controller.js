'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bill_sale_detail = mongoose.model('Bill_sale_detail'),
  Keys = require(path.resolve('./modules/keys/server/controllers/keys.server.controller')),
  Groups = require(path.resolve('./modules/groups/server/controllers/groups-custom.server.controller')),
  Consumptions = require(path.resolve('./modules/service_consumptions/server/controllers/service_consumptions.server.controller')),
  Agreements = require(path.resolve('./modules/agreements/server/controllers/agreements-custom.server.controller')),
  Users = require(path.resolve('./modules/users/server/controllers/users/users.custom-queries.server.controller')),
  Bill_header= require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bill_sale_detail
 */
exports.getBillPayment = async (req, res) => {
  let totals = [];
  let lastConsume = 0;
  let month = req.query.month;
  let year = req.query.year;
  let department;
  let fullUser;
  //  Caso Admin, si ha elegido un departament Id 
  if(req.query.departmentId) {
    department = { departmentId: req.query.departmentId };
  } else {
    fullUser = await Users.userClientPopulation(req.user);
    department = await Agreements.getDepartmentByAgreement(fullUser.client._id);
  }
  let header = await Bill_header.getHeaderIdByDepartmentAndMonth(department.departmentId, month, year);
  let details = await this.getDetailsByHeader(header);

  //  Get AVG WATER AND LAST CONSUME
  let condominiumData = await Keys.getGroupByDepartmentId(department.departmentId);
  let avgWaterSupply = await Groups.getAvgWaterSupply(condominiumData.group);
  let lastConsumption = await Consumptions.verifyPreviousConsume(department.departmentId, month);
  if(lastConsumption) lastConsume = lastConsumption.consumed;
  //  Get AVG WATER AND LAST CONSUME

  //  Get Condominium information


  let total = 0;
  details.forEach((key) => {
    total = total + key.totalAmount;
  });

  let data = {
    fullUser: fullUser,
    department: department,
    header: header,
    details: details,
    total: total.toFixed(2),
    avgWaterSupply: avgWaterSupply,
    lastConsume: lastConsume,
    informative: condominiumData
  };
  res.json(data);
};

exports.getTotalsByMonths = async (req, res) => {
  let totalMonths = [];
  let month = req.query.month;
  let department;
  let fullUser;
  fullUser = await Users.userClientPopulation(req.user);
  department = await Agreements.getDepartmentByAgreement(fullUser.client._id);

  for(let i = 1; i<13; i++) {
    let name = this.getMonthName(i);
    let total = 0;
    let header = await Bill_header.getHeaderIdByDepartmentAndMonth(department.departmentId._id, i);
    let details = await this.getDetailsByHeader(header);
    details.forEach((key) => {
      total = total + key.totalAmount;
    });
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
}
