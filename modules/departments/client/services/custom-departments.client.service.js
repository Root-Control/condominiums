(function () {
  'use strict';

  angular
    .module('departments.services')
    .factory('DepartmentCustomService', DepartmentCustomService);

  DepartmentCustomService.$inject = ['$http'];

  function DepartmentCustomService($http) {
    var me = this;
    me.getDepartmentsByCondominiumId = function(id, month, options) {
      $http.get('/api/departmentsbycondominium?condominiumId=' + id + '&month=' + month)
      .then(options.success, options.error);
    };

    me.getDepartmentsByTowerId = function(towerId, month, year, options) {
      $http.get('/api/departmentsbytower?towerId=' + towerId + '&month=' + month + '&year=' + year)
      .then(options.success, options.error);
    };

    me.searchDepartmentsByCodeRegex = function(code, options) {
      $http.get('/api/getdepartmentsbycode?code=' + code)
        .then(options.success, options.error);
    };

    me.getQtyActiveDepartments = function(options) {
      $http.get('/api/departments/activedepartments')
        .then(options.success, options.error);
    }

    return {
      departmentsByCondominium: me.getDepartmentsByCondominiumId,
      searchDepartments: me.searchDepartmentsByCodeRegex,
      activeDepartments: me.getQtyActiveDepartments,
      getDepartmentsByTowerId: me.getDepartmentsByTowerId
    }
  }
}());
