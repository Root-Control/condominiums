  'use strict';

/**
 * Module dependencies
 */
var paymentsPolicy = require('../policies/payments.server.policy'),
  payments = require('../controllers/payments.server.controller');

module.exports = function (app) {
  // Payments collection routes
  app.route('/api/payments').all(paymentsPolicy.isAllowed)
    .get(payments.list);

  app.route('/api/requestpaymentdata')
    .get(payments.requestPaymentData);

  app.route('/api/generatepay')
    .post(payments.generatePaymentToPdf);

  // Single payment routes
  app.route('/api/payments/:paymentId').all(paymentsPolicy.isAllowed)
    .get(payments.read)
    .put(payments.update)
    .delete(payments.delete);

  // Finish by binding the payment middleware
  app.param('paymentId', payments.paymentByID);
};
