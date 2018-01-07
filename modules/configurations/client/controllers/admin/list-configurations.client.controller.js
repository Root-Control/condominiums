(function () {
  'use strict';

  angular
    .module('configurations.admin')
    .controller('ConfigurationsAdminListController', ConfigurationsAdminListController);

  ConfigurationsAdminListController.$inject = ['ConfigurationsService'];

  function ConfigurationsAdminListController(ConfigurationsService) {
    var vm = this;

    vm.configurations = ConfigurationsService.query();
  }
}());
