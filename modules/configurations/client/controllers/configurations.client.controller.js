(function () {
  'use strict';

  angular
    .module('configurations')
    .controller('ConfigurationsController', ConfigurationsController);

  ConfigurationsController.$inject = ['$scope', 'configurationResolve', 'Authentication'];

  function ConfigurationsController($scope, configuration, Authentication) {
    var vm = this;

    vm.configuration = configuration;
    vm.authentication = Authentication;

  }
}());
