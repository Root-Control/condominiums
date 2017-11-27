(function () {
  'use strict';

  angular
    .module('tower_services')
    .controller('Tower_servicesListController', Tower_servicesListController);

  Tower_servicesListController.$inject = ['Tower_servicesService'];

  function Tower_servicesListController(Tower_servicesService) {
    var vm = this;

    vm.tower_services = Tower_servicesService.query();
  }
}());
