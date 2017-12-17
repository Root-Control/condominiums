(function () {
  'use strict';

  angular
    .module('supplies.admin')
    .controller('SuppliesAdminController', SuppliesAdminController);

  SuppliesAdminController.$inject = ['$scope', '$state', '$window', 'ServicesService', 'supplieResolve', 'Authentication', 'Notification', 'CondominiumsService', 'DepartmentsService', 'GroupsService', 'TowersService'];

  function SuppliesAdminController($scope, $state, $window, ServicesService, supplie, Authentication, Notification, GlobalService, DepartmentsService, GroupsService, TowersService) {
    var vm = this;

    vm.services = ServicesService.query();
    console.log(vm.services);
  }
}());
