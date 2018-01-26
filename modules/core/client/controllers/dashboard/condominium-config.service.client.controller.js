(function () {
  'use strict';

  angular
    .module('core')
    .controller('CondominiumConfig', CondominiumConfig);

  CondominiumConfig.$inject = ['$window', '$scope', '$state', 'Authentication', 'Messages', 'TowersService', 'Consumption'];

  function CondominiumConfig($window, $scope, $state, Authentication, Messages, TowersService, Consumption) {
    var vm = this;
    vm.authentication = Authentication;
  }
}());
