'use strict';

/**
 * Module dependencies
 */
var bill_sale_detailsPolicy = require('../policies/bill_sale_details.server.policy'),
  bill_sale_details = require('../controllers/bill_sale_details.server.controller');

module.exports = function (app) {
  // Bill_sale_details collection routes
  app.route('/api/bill_sale_details').all(bill_sale_detailsPolicy.isAllowed)
    .get(bill_sale_details.list)
    .post(bill_sale_details.create);

  app.route('/api/gettotals')
    .get(bill_sale_details.getTotalsByMonths);

  app.route('/api/calculatepay')
    .get(bill_sale_details.getBillPayment);

  // Single bill_sale_detail routes
  app.route('/api/bill_sale_details/:bill_sale_detailId').all(bill_sale_detailsPolicy.isAllowed)
    .get(bill_sale_details.read)
    .put(bill_sale_details.update)
    .delete(bill_sale_details.delete);

  // Finish by binding the bill_sale_detail middleware
  app.param('bill_sale_detailId', bill_sale_details.bill_sale_detailByID);
};
