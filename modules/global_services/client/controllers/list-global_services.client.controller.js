(function () {
  'use strict';

  angular
    .module('global_services')
    .controller('Global_servicesListController', Global_servicesListController);

  Global_servicesListController.$inject = ['Global_servicesService'];

  function Global_servicesListController(Global_servicesService) {
    var vm = this;

    vm.global_services = Global_servicesService.query();
  }
}());
