(function () {
  'use strict';

  angular
    .module('services')
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = ['$scope', 'serviceResolve', 'Authentication'];

  function ServicesController($scope, service, Authentication) {
    var vm = this;

    vm.service = service;
    vm.authentication = Authentication;

  }
}());
