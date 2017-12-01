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

exports.create = function (req, res) {
  var bill_sale_header = new Bill_sale_header(req.body);
  bill_sale_header.user = req.user;

  bill_sale_header.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_header);
    }
  });
};

/**
 * Show the current bill_sale_header
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bill_sale_header = req.bill_sale_header ? req.bill_sale_header.toJSON() : {};

  // Add a custom field to the Bill_sale_header, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Bill_sale_header model.
  bill_sale_header.isCurrentUserOwner = !!(req.user && bill_sale_header.user && bill_sale_header.user._id.toString() === req.user._id.toString());

  res.json(bill_sale_header);
};

/**
 * Update an bill_sale_header
 */
exports.update = function (req, res) {
  var bill_sale_header = req.bill_sale_header;

  bill_sale_header.title = req.body.title;
  bill_sale_header.content = req.body.content;

  bill_sale_header.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_header);
    }
  });
};

/**
 * Delete an bill_sale_header
 */
exports.delete = function (req, res) {
  var bill_sale_header = req.bill_sale_header;

  bill_sale_header.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_header);
    }
  });
};

/**
 * List of Bill_sale_headers
 */
exports.list = function (req, res) {
  Bill_sale_header.find().sort('-created').populate('user', 'displayName').exec(function (err, bill_sale_headers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill_sale_headers);
    }
  });
};

/**
 * Bill_sale_header middleware
 */
exports.bill_sale_headerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bill_sale_header is invalid'
    });
  }

  Bill_sale_header.findById(id).populate('user', 'displayName').exec(function (err, bill_sale_header) {
    if (err) {
      return next(err);
    } else if (!bill_sale_header) {
      return res.status(404).send({
        message: 'No bill_sale_header with that identifier has been found'
      });
    }
    req.bill_sale_header = bill_sale_header;
    next();
  });
};
