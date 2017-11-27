(function () {
  'use strict';

  angular
    .module('tower_services.admin')
    .controller('Tower_servicesAdminListController', Tower_servicesAdminListController);

  Tower_servicesAdminListController.$inject = ['Tower_servicesService'];

  function Tower_servicesAdminListController(Tower_servicesService) {
    var vm = this;

    vm.tower_services = Tower_servicesService.query();
  }
}());
