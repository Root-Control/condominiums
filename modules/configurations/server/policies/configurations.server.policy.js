'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Configurations Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin', 'c-admin'],
    allows: [{
      resources: '/api/configurations',
      permissions: '*'
    }, {
      resources: '/api/configurations/:configurationId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/configurations',
      permissions: ['get']
    }, {
      resources: '/api/configurations/:configurationId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/configurations',
      permissions: ['get']
    }, {
      resources: '/api/configurations/:configurationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Configurations Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an configuration is being processed and the current user created it then allow any manipulation
  if (req.configuration && req.user && req.configuration.user && req.configuration.user.id === req.user.id) {
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
