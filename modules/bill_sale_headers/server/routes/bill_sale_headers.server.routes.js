'use strict';

/**
 * Module dependencies
 */
var bill_sale_headersPolicy = require('../policies/bill_sale_headers.server.policy'),
  bill_sale_headers = require('../controllers/bill_sale_headers.server.controller');

module.exports = function (app) {
  // Bill_sale_headers collection routes
  app.route('/api/bill_sale_headers').all(bill_sale_headersPolicy.isAllowed)
    .get(bill_sale_headers.list)
    .post(bill_sale_headers.create);

  // Single bill_sale_header routes
  app.route('/api/bill_sale_headers/:bill_sale_headerId').all(bill_sale_headersPolicy.isAllowed)
    .get(bill_sale_headers.read)
    .put(bill_sale_headers.update)
    .delete(bill_sale_headers.delete);

  // Finish by binding the bill_sale_header middleware
  app.param('bill_sale_headerId', bill_sale_headers.bill_sale_headerByID);
};
