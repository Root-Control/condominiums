'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bill_sale_detail = mongoose.model('Bill_sale_detail'),
  Agreements = require(path.resolve('./modules/agreements/server/controllers/agreements-custom.server.controller')),
  Users = require(path.resolve('./modules/users/server/controllers/users/users.custom-queries.server.controller')),
  Bill_header= require(path.resolve('./modules/bill_sale_headers/server/controllers/bill_sale_header_service.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bill_sale_detail
 */
exports.getBillPayment = async (req, res) => {
  let month = req.query.month;
  console.log(req.query.month);
  let fullUser = await Users.userClientPopulation(req.user);
  let department = await Agreements.getDepartmentByAgreement(fullUser.client._id);
  let header = await Bill_header.getHeaderIdByDepartmentAndMonth(department.departmentId, month);
  let details = await this.getDetailsByHeader(header);
  let data = {
    fullUser: fullUser,
    department: department,
    header: header,
    details: details
  };
  res.json(data);
};


exports.create = function (data, cb) {
  var bill_sale_detail = new Bill_sale_detail(data);
  bill_sale_detail.save(function (err) {
    console.log('done');
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
