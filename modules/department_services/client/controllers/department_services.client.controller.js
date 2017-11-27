(function () {
  'use strict';

  angular
    .module('department_services')
    .controller('Department_servicesController', Department_servicesController);

  Department_servicesController.$inject = ['$scope', 'department_serviceResolve', 'Authentication'];

  function Department_servicesController($scope, department_service, Authentication) {
    var vm = this;

    vm.department_service = department_service;
    vm.authentication = Authentication;

  }
}());
