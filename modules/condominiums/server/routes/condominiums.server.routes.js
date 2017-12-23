'use strict';

/**
 * Module dependencies
 */
var condominiumsPolicy = require('../policies/condominiums.server.policy'),
  condominiums = require('../controllers/condominiums.server.controller');

module.exports = function (app) {
  // Condominiums collection routes
  app.route('/api/condominiums').all(condominiumsPolicy.isAllowed)
    .get(condominiums.list)
    .post(condominiums.create);

  app.route('/api/condominiums/registerservices')
    .post(condominiums.updateCondominiumSupplies);

  // Single condominium routes
  app.route('/api/condominiums/:condominiumId').all(condominiumsPolicy.isAllowed)
    .get(condominiums.read)
    .put(condominiums.update)
    .delete(condominiums.delete);

  // Finish by binding the condominium middleware
  app.param('condominiumId', condominiums.condominiumByID);
};
