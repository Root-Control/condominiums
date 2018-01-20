'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Client = mongoose.model('Client'),
  User = require(path.resolve('./modules/users/server/controllers/users/users.authentication.server.controller')),
  UserValidate = require(path.resolve('./modules/users/server/controllers/users/users.custom-queries.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an client
 */
exports.create = async (req, res) => {
  var client = new Client(req.body);
  client.user = req.user;

  let data = {};
  data.username = client.document;
  data.email = client.email;
  let exists = await UserValidate.validateAvailableUser(data);

  if(exists) {
    return res.status(422).send({
        message: 'No se puede crear el usuario, por favor verifica dni o email'
      });
  }

  client.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.signup({ body: { condominium: req.body.condominium, client: client._id, email: client.email, password: 'C@ndomini0', document: client.document, firstName: client.name, lastName: client.lastName } }, function (err, response) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(client);
        }
      }, false);
    }
  });
};

/**
 * Show the current client
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var client = req.client ? req.client.toJSON() : {};

  // Add a custom field to the Client, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Client model.
  client.isCurrentUserOwner = !!(req.user && client.user && client.user._id.toString() === req.user._id.toString());

  res.json(client);
};

/**
 * Update an client
 */
exports.update = function (req, res) {
  var client = req.client;

  client.name = req.body.name;
  client.phone = req.body.phone;
  client.lastName = req.body.lastName;
  client.document = req.body.document;
  client.birthDate = req.body.birthDate;
  client.cellphone = req.body.cellphone;
  client.email = req.body.email;

  client.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * Delete an client
 */
exports.delete = function (req, res) {
  var client = req.client;

  client.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
    }
  });
};

/**
 * List of Clients
 */
exports.list = function (req, res) {
  Client.find().sort('-created').populate('user', 'displayName').exec(function (err, clients) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(clients);
    }
  });
};

/**
 * Client middleware
 */
exports.clientByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Client is invalid'
    });
  }

  Client.findById(id).populate('user', 'displayName').exec(function (err, client) {
    if (err) {
      return next(err);
    } else if (!client) {
      return res.status(404).send({
        message: 'No client with that identifier has been found'
      });
    }
    req.client = client;
    next();
  });
};
