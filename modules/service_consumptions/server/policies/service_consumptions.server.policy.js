'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Service_consumptions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin', 'c-admin'],
    allows: [{
      resources: '/api/service_consumptions',
      permissions: '*'
    }, {
      resources: '/api/service_consumptions/:service_consumptionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/service_consumptions',
      permissions: ['get']
    }, {
      resources: '/api/service_consumptions/:service_consumptionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/service_consumptions',
      permissions: ['get']
    }, {
      resources: '/api/service_consumptions/:service_consumptionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Service_consumptions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an service_consumption is being processed and the current user created it then allow any manipulation
  if (req.service_consumption && req.user && req.service_consumption.user && req.service_consumption.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
