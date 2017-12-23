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

    me.searchDepartmentsByCodeRegex = function(code, options) {
      $http.get('/api/getdepartmentsbycode?code=' + code)
        .then(options.success, options.error);
    };

    return {
      departmentsByCondominium: me.getDepartmentsByCondominiumId,
      searchDepartments: me.searchDepartmentsByCodeRegex
    }
  }
}());
