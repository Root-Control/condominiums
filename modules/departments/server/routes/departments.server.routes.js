'use strict';

/**
 * Module dependencies
 */
var departmentsPolicy = require('../policies/departments.server.policy'),
  departments = require('../controllers/departments.server.controller'),
  custom_departments = require('../controllers/department-custom.server.controller');

module.exports = function (app) {
  // Departments collection routes
  app.route('/api/departments').all(departmentsPolicy.isAllowed)
    .get(departments.list)
    .post(departments.create);

  app.route('/api/departmentsbycondominium')
    .get(custom_departments.getDepartmentsByCondominium);

  app.route('/api/getdepartmentsbycode')
    .get(custom_departments.getDepartmentsByCodeRegex);

  app.route('/api/departments/activedepartments')
    .get(custom_departments.getActiveDepartmentsQty);
  // Single department routes
  app.route('/api/departments/:departmentId').all(departmentsPolicy.isAllowed)
    .get(departments.read)
    .put(departments.update)
    .delete(departments.delete);

  app.route('/api/department/generate')
    .get(custom_departments.generateBill);
  // Finish by binding the department middleware
  app.param('departmentId', departments.departmentByID);
};
