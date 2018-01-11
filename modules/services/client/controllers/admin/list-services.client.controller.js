(function () {
  'use strict';

  angular
    .module('services.admin')
    .controller('ServicesAdminListController', ServicesAdminListController);

  ServicesAdminListController.$inject = ['ServicesService', 'Authentication'];

  function ServicesAdminListController(ServicesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user.roles[0] === 'superadmin') vm.services = ServicesService.query({ active: true });
    else vm.services = ServicesService.query({ condominium: vm.authentication.user.condominium, active: true });
  }
}());
