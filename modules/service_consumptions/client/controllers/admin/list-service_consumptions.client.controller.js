(function () {
  'use strict';

  angular
    .module('service_consumptions.admin')
    .controller('Service_consumptionsAdminListController', Service_consumptionsAdminListController);

  Service_consumptionsAdminListController.$inject = ['Service_consumptionsService'];

  function Service_consumptionsAdminListController(Service_consumptionsService) {
    var vm = this;

    vm.service_consumptions = Service_consumptionsService.query();
  }
}());
