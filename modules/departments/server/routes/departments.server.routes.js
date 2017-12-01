'use strict';

/**
 * Module dependencies
 */
var departmentsPolicy = require('../policies/departments.server.policy'),
  departments = require('../controllers/departments.server.controller'),
  bill_departments = require('../controllers/department-custom.server.controller');

module.exports = function (app) {
  // Departments collection routes
  app.route('/api/departments').all(departmentsPolicy.isAllowed)
    .get(departments.list)
    .post(departments.create);

  // Single department routes
  app.route('/api/departments/:departmentId').all(departmentsPolicy.isAllowed)
    .get(departments.read)
    .put(departments.update)
    .delete(departments.delete);

  app.route('/api/department/generate')
    .get(bill_departments.generateBill);
  // Finish by binding the department middleware
  app.param('departmentId', departments.departmentByID);
};
