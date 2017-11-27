(function () {
  'use strict';

  angular
    .module('global_services.admin')
    .controller('Global_servicesAdminListController', Global_servicesAdminListController);

  Global_servicesAdminListController.$inject = ['Global_servicesService'];

  function Global_servicesAdminListController(Global_servicesService) {
    var vm = this;

    vm.global_services = Global_servicesService.query();
  }
}());
