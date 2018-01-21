'use strict';

/**
 * Module dependencies
 */
var service_consumptionsPolicy = require('../policies/service_consumptions.server.policy'),
  service_consumptions = require('../controllers/service_consumptions.server.controller');

module.exports = function (app) {
  // Service_consumptions collection routes
  app.route('/api/service_consumptions').all(service_consumptionsPolicy.isAllowed)
    .get(service_consumptions.list)
    .post(service_consumptions.create);

  app.route('/api/bulk/service_consumptions')
    .post(service_consumptions.bulkConsumption);

  app.route('/api/service_consumptions/massivedelete/:id')
    .delete(service_consumptions.deleteMassiveConsumptions);

  // Single service_consumption routes
  app.route('/api/service_consumptions/:service_consumptionId').all(service_consumptionsPolicy.isAllowed)
    .get(service_consumptions.read)
    .put(service_consumptions.update)
    .delete(service_consumptions.delete);

  // Finish by binding the service_consumption middleware
  app.param('service_consumptionId', service_consumptions.service_consumptionByID);
};
