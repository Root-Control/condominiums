'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Supplies Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin', 'c-admin'],
    allows: [{
      resources: '/api/supplies',
      permissions: '*'
    }, {
      resources: '/api/supplies/:supplieId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/supplies',
      permissions: ['get']
    }, {
      resources: '/api/supplies/:supplieId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/supplies',
      permissions: ['get']
    }, {
      resources: '/api/supplies/:supplieId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Supplies Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an supplie is being processed and the current user created it then allow any manipulation
  if (req.supplie && req.user && req.supplie.user && req.supplie.user.id === req.user.id) {
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
