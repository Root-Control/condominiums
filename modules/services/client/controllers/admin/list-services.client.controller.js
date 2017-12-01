(function () {
  'use strict';

  angular
    .module('services.admin')
    .controller('ServicesAdminListController', ServicesAdminListController);

  ServicesAdminListController.$inject = ['ServicesService'];

  function ServicesAdminListController(ServicesService) {
    var vm = this;

    vm.services = ServicesService.query();
  }
}());
