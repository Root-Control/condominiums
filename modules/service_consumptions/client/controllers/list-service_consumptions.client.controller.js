(function () {
  'use strict';

  angular
    .module('service_consumptions')
    .controller('Service_consumptionsListController', Service_consumptionsListController);

  Service_consumptionsListController.$inject = ['Service_consumptionsService'];

  function Service_consumptionsListController(Service_consumptionsService) {
    var vm = this;

    vm.service_consumptions = Service_consumptionsService.query();
  }
}());
