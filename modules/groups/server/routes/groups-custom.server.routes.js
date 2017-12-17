'use strict';

/**
 * Module dependencies
 */
var groupsPolicy = require('../policies/groups.server.policy'),
  groups = require('../controllers/groups-custom.server.controller');

module.exports = function (app) {
  // Groups collection routes
  app.route('/api/groupforcondominium')//	.all(groupsPolicy.isAllowed)
    .post(groups.listGroupsForCondominiumId);
};
