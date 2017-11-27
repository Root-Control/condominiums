'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Condominiums Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['superadmin'],
    allows: [{
      resources: '/api/condominiums',
      permissions: '*'
    }, {
      resources: '/api/condominiums/:condominiumId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Condominiums Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an condominium is being processed and the current user created it then allow any manipulation
  if (req.condominium && req.user && req.condominium.user && req.condominium.user.id === req.user.id) {
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
