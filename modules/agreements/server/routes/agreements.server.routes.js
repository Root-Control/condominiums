'use strict';

/**
 * Module dependencies
 */
var agreementsPolicy = require('../policies/agreements.server.policy'),
  agreements = require('../controllers/agreements.server.controller'),
  agreements_custom = require('../controllers/agreements-custom.server.controller');

module.exports = function (app) {
  // Agreements collection routes
  app.route('/api/agreements').all(agreementsPolicy.isAllowed)
    .get(agreements.list)
    .post(agreements.create);

  app.route('/api/agreements/verify')
    .get(agreements_custom.getUserContract);

  // Single agreement routes
  app.route('/api/agreements/:agreementId').all(agreementsPolicy.isAllowed)
    .get(agreements.read)
    .put(agreements.update)
    .delete(agreements.delete);

  // Finish by binding the agreement middleware
  app.param('agreementId', agreements.agreementByID);
};
