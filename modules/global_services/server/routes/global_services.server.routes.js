'use strict';

/**
 * Module dependencies
 */
var global_servicesPolicy = require('../policies/global_services.server.policy'),
  global_services = require('../controllers/global_services.server.controller');

module.exports = function (app) {
  // Global_services collection routes
  app.route('/api/global_services').all(global_servicesPolicy.isAllowed)
    .get(global_services.list)
    .post(global_services.create);

  // Single global_service routes
  app.route('/api/global_services/:global_serviceId').all(global_servicesPolicy.isAllowed)
    .get(global_services.read)
    .put(global_services.update)
    .delete(global_services.delete);

  // Finish by binding the global_service middleware
  app.param('global_serviceId', global_services.global_serviceByID);
};
