(function () {
  'use strict';

  angular
    .module('configurations')
    .controller('ConfigurationsListController', ConfigurationsListController);

  ConfigurationsListController.$inject = ['ConfigurationsService', 'Authentication'];

  function ConfigurationsListController(ConfigurationsService, Authentication) {
    var vm = this;
	vm.authentication = Authentication;

    if (vm.authentication.user.roles[0] === 'superadmin') vm.configurations = ConfigurationsService.query();
    else vm.configurations = ConfigurationsService.query({ condominiumId: vm.authentication.user.condominium });
  }
}());
