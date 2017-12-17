'use strict';

/**
 * Module dependencies
 */
var suppliesPolicy = require('../policies/supplies.server.policy'),
  supplies = require('../controllers/supplies.server.controller');

module.exports = function (app) {
  // Supplies collection routes
  app.route('/api/supplies').all(suppliesPolicy.isAllowed)
    .get(supplies.list)
    .post(supplies.create);

  // Single supplie routes
  app.route('/api/supplies/:supplieId').all(suppliesPolicy.isAllowed)
    .get(supplies.read)
    .put(supplies.update)
    .delete(supplies.delete);

  // Finish by binding the supplie middleware
  app.param('supplieId', supplies.supplieByID);
};
