'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Groups Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['superadmin'],
    allows: [{
      resources: '/api/groups',
      permissions: '*'
    }, {
      resources: '/api/groups/:groupId',
      permissions: '*'
    }]
  },
  {
    roles: ['superadmin'],
    allows: [{
      resources: '/api/groupforcondominium',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Groups Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an group is being processed and the current user created it then allow any manipulation
  if (req.group && req.user && req.group.user && req.group.user.id === req.user.id) {
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
