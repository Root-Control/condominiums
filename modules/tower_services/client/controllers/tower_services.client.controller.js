(function () {
  'use strict';

  angular
    .module('tower_services')
    .controller('Tower_servicesController', Tower_servicesController);

  Tower_servicesController.$inject = ['$scope', 'tower_serviceResolve', 'Authentication'];

  function Tower_servicesController($scope, tower_service, Authentication) {
    var vm = this;

    vm.tower_service = tower_service;
    vm.authentication = Authentication;

  }
}());
