'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Bill_sale_headers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin', 'c-admin'],
    allows: [{
      resources: '/api/bill_sale_headers',
      permissions: '*'
    }, {
      resources: '/api/bill_sale_headers/:bill_sale_headerId',
      permissions: '*'
    },{
      resources: '/api/custom_bill_sale_headers/updatestatus',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/bill_sale_headers',
      permissions: ['get']
    }, {
      resources: '/api/bill_sale_headers/:bill_sale_headerId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/bill_sale_headers',
      permissions: ['get']
    }, {
      resources: '/api/bill_sale_headers/:bill_sale_headerId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Bill_sale_headers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an bill_sale_header is being processed and the current user created it then allow any manipulation
  if (req.bill_sale_header && req.user && req.bill_sale_header.user && req.bill_sale_header.user.id === req.user.id) {
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
