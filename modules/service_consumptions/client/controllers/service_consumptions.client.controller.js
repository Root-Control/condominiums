(function () {
  'use strict';

  angular
    .module('service_consumptions')
    .controller('Service_consumptionsController', Service_consumptionsController);

  Service_consumptionsController.$inject = ['$scope', 'service_consumptionResolve', 'Authentication'];

  function Service_consumptionsController($scope, service_consumption, Authentication) {
    var vm = this;

    vm.service_consumption = service_consumption;
    vm.authentication = Authentication;

  }
}());
