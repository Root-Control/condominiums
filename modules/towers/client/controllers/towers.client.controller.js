(function () {
  'use strict';

  angular
    .module('towers')
    .controller('TowersController', TowersController);

  TowersController.$inject = ['$scope', 'towerResolve', 'Authentication', 'ServicesService'];

  function TowersController($scope, tower, Authentication, Service) {
    var vm = this;

    vm.tower = tower;
    vm.authentication = Authentication;
  }
}());
