'use strict';

/**
 * Module dependencies
 */
var tower_servicesPolicy = require('../policies/tower_services.server.policy'),
  tower_services = require('../controllers/tower_services.server.controller');

module.exports = function (app) {
  // Tower_services collection routes
  app.route('/api/tower_services').all(tower_servicesPolicy.isAllowed)
    .get(tower_services.list)
    .post(tower_services.create);

  // Single tower_service routes
  app.route('/api/tower_services/:tower_serviceId').all(tower_servicesPolicy.isAllowed)
    .get(tower_services.read)
    .put(tower_services.update)
    .delete(tower_services.delete);

  // Finish by binding the tower_service middleware
  app.param('tower_serviceId', tower_services.tower_serviceByID);
};
