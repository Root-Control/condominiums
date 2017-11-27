'use strict';

/**
 * Module dependencies
 */
var group_servicesPolicy = require('../policies/group_services.server.policy'),
  group_services = require('../controllers/group_services.server.controller');

module.exports = function (app) {
  // Group_Services collection routes
  app.route('/api/group_services').all(group_servicesPolicy.isAllowed)
    .get(group_services.list)
    .post(group_services.create);

  // Single group_service routes
  app.route('/api/group_services/:group_serviceId').all(group_servicesPolicy.isAllowed)
    .get(group_services.read)
    .put(group_services.update)
    .delete(group_services.delete);

  // Finish by binding the group_service middleware
  app.param('group_serviceId', group_services.group_serviceByID);
};
