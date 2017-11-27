(function () {
  'use strict';

  angular
    .module('departments.admin')
    .controller('DepartmentsAdminListController', DepartmentsAdminListController);

  DepartmentsAdminListController.$inject = ['DepartmentsService'];

  function DepartmentsAdminListController(DepartmentsService) {
    var vm = this;

    vm.departments = DepartmentsService.query();
  }
}());
