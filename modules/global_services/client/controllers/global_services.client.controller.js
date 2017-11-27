(function () {
  'use strict';

  angular
    .module('global_services')
    .controller('Global_servicesController', Global_servicesController);

  Global_servicesController.$inject = ['$scope', 'global_serviceResolve', 'Authentication'];

  function Global_servicesController($scope, global_service, Authentication) {
    var vm = this;

    vm.global_service = global_service;
    vm.authentication = Authentication;

  }
}());
