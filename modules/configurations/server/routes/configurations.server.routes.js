'use strict';

/**
 * Module dependencies
 */
var configurationsPolicy = require('../policies/configurations.server.policy'),
  configurations = require('../controllers/configurations.server.controller');

module.exports = function (app) {
  // Configurations collection routes
  app.route('/api/configurations').all(configurationsPolicy.isAllowed)
    .get(configurations.list)
    .post(configurations.create);

  // Single configuration routes
  app.route('/api/configurations/:configurationId').all(configurationsPolicy.isAllowed)
    .get(configurations.read)
    .put(configurations.update)
    .delete(configurations.delete);

  // Finish by binding the configuration middleware
  app.param('configurationId', configurations.configurationByID);
};
