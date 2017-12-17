'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Agreement = mongoose.model('Agreement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an agreement
 */

exports.create = function (req, res) {
  var agreement = new Agreement(req.body);
  agreement.user = req.user;

  agreement.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(agreement);
    }
  });
};

/**
 * Show the current agreement
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var agreement = req.agreement ? req.agreement.toJSON() : {};

  // Add a custom field to the Agreement, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Agreement model.
  agreement.isCurrentUserOwner = !!(req.user && agreement.user && agreement.user._id.toString() === req.user._id.toString());

  res.json(agreement);
};

/**
 * Update an agreement
 */
exports.update = function (req, res) {
  var agreement = req.agreement;

  agreement.title = req.body.title;
  agreement.content = req.body.content;

  agreement.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(agreement);
    }
  });
};

/**
 * Delete an agreement
 */
exports.delete = function (req, res) {
  var agreement = req.agreement;

  agreement.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(agreement);
    }
  });
};

/**
 * List of Agreements
 */
exports.list = function (req, res) {
  Agreement.find().sort('-created').populate('user', 'displayName').populate('clientId')
    .populate({
      path: 'departmentId',
      populate: { path: 'tower', populate: { path: 'groupAssigned' } }
    }).exec(function (err, agreements) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(agreements);
    }
  });
};

/**
 * Agreement middleware
 */
exports.agreementByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Agreement is invalid'
    });
  }

  Agreement.findById(id).populate('user', 'displayName').exec(function (err, agreement) {
    if (err) {
      return next(err);
    } else if (!agreement) {
      return res.status(404).send({
        message: 'No agreement with that identifier has been found'
      });
    }
    req.agreement = agreement;
    next();
  });
};
