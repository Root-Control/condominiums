(function () {
  'use strict';

  angular
    .module('department_services.admin')
    .controller('Department_servicesAdminListController', Department_servicesAdminListController);

  Department_servicesAdminListController.$inject = ['Department_servicesService'];

  function Department_servicesAdminListController(Department_servicesService) {
    var vm = this;

    vm.department_services = Department_servicesService.query();
  }
}());
