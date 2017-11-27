'use strict';

/**
 * Module dependencies
 */
var department_servicesPolicy = require('../policies/department_services.server.policy'),
  department_services = require('../controllers/department_services.server.controller');

module.exports = function (app) {
  // Department_services collection routes
  app.route('/api/department_services').all(department_servicesPolicy.isAllowed)
    .get(department_services.list)
    .post(department_services.create);

  // Single department_service routes
  app.route('/api/department_services/:department_serviceId').all(department_servicesPolicy.isAllowed)
    .get(department_services.read)
    .put(department_services.update)
    .delete(department_services.delete);

  // Finish by binding the department_service middleware
  app.param('department_serviceId', department_services.department_serviceByID);
};
