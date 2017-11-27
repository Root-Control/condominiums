'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Global_services Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin'],
    allows: [{
      resources: '/api/global_services',
      permissions: '*'
    }, {
      resources: '/api/global_services/:global_serviceId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/global_services',
      permissions: ['get']
    }, {
      resources: '/api/global_services/:global_serviceId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/global_services',
      permissions: ['get']
    }, {
      resources: '/api/global_services/:global_serviceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Global_services Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an global_service is being processed and the current user created it then allow any manipulation
  if (req.global_service && req.user && req.global_service.user && req.global_service.user.id === req.user.id) {
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
