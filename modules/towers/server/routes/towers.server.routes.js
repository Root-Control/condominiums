'use strict';

/**
 * Module dependencies
 */
var towersPolicy = require('../policies/towers.server.policy'),
  towers = require('../controllers/towers.server.controller');

module.exports = function (app) {
  // Towers collection routes
  app.route('/api/towers').all(towersPolicy.isAllowed)
    .get(towers.list)
    .post(towers.create);

  // Single tower routes
  app.route('/api/towers/:towerId').all(towersPolicy.isAllowed)
    .get(towers.read)
    .put(towers.update)
    .delete(towers.delete);

  // Finish by binding the tower middleware
  app.param('towerId', towers.towerByID);
};
