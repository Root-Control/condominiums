'use strict';

/**
 * Module dependencies
 */
var servicesPolicy = require('../policies/services.server.policy'),
  services = require('../controllers/services.server.controller');

module.exports = function (app) {
  // Services collection routes
  app.route('/api/services').all(servicesPolicy.isAllowed)
    .get(services.list)
    .post(services.create);


  app.route('/api/services/unregistered')
    .post(services.getUnregisteredServices);
  // Single service routes
  app.route('/api/services/:serviceId').all(servicesPolicy.isAllowed)
    .get(services.read)
    .put(services.update)
    .delete(services.delete);

  // Finish by binding the service middleware
  app.param('serviceId', services.serviceByID);
};
