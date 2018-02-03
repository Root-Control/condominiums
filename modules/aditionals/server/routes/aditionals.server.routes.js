'use strict';

/**
 * Module dependencies
 */
var aditionalsPolicy = require('../policies/aditionals.server.policy'),
  aditionals = require('../controllers/aditionals.server.controller');

module.exports = function (app) {
  // Aditionals collection routes
  app.route('/api/aditionals').all(aditionalsPolicy.isAllowed)
    .get(aditionals.list)
    .post(aditionals.create);

  // Single aditional routes
  app.route('/api/aditionals/:aditionalId').all(aditionalsPolicy.isAllowed)
    .get(aditionals.read)
    .put(aditionals.update)
    .delete(aditionals.delete);

  // Finish by binding the aditional middleware
  app.param('aditionalId', aditionals.aditionalByID);
};
