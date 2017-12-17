'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Bill_sale_details Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superadmin', 'c-admin'],
    allows: [{
      resources: '/api/bill_sale_details',
      permissions: '*'
    }, {
      resources: '/api/bill_sale_details/:bill_sale_detailId',
      permissions: '*'
    },{
      resources: '/api/bill_sale_details/getbill/:headerid',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/bill_sale_details',
      permissions: ['get']
    }, {
      resources: '/api/bill_sale_details/:bill_sale_detailId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/bill_sale_details',
      permissions: ['get']
    }, {
      resources: '/api/bill_sale_details/:bill_sale_detailId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Bill_sale_details Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an bill_sale_detail is being processed and the current user created it then allow any manipulation
  if (req.bill_sale_detail && req.user && req.bill_sale_detail.user && req.bill_sale_detail.user.id === req.user.id) {
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
