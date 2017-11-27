(function () {
  'use strict';

  angular
    .module('department_services')
    .controller('Department_servicesListController', Department_servicesListController);

  Department_servicesListController.$inject = ['Department_servicesService'];

  function Department_servicesListController(Department_servicesService) {
    var vm = this;

    vm.department_services = Department_servicesService.query();
  }
}());
