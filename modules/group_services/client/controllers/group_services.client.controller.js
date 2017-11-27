(function () {
  'use strict';

  angular
    .module('group_services')
    .controller('Group_ServicesController', Group_ServicesController);

  Group_ServicesController.$inject = ['$scope', 'group_serviceResolve', 'Authentication'];

  function Group_ServicesController($scope, group_service, Authentication) {
    var vm = this;

    vm.group_service = group_service;
    vm.authentication = Authentication;

  }
}());
