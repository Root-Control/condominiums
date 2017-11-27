'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Department_services Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin'],
    allows: [{
      resources: '/api/department_services',
      permissions: '*'
    }, {
      resources: '/api/department_services/:department_serviceId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/department_services',
      permissions: ['get']
    }, {
      resources: '/api/department_services/:department_serviceId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/department_services',
      permissions: ['get']
    }, {
      resources: '/api/department_services/:department_serviceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Department_services Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an department_service is being processed and the current user created it then allow any manipulation
  if (req.department_service && req.user && req.department_service.user && req.department_service.user.id === req.user.id) {
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
