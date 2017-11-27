(function () {
  'use strict';

  angular
    .module('towers')
    .controller('TowersController', TowersController);

  TowersController.$inject = ['$scope', 'towerResolve', 'Authentication'];

  function TowersController($scope, tower, Authentication) {
    var vm = this;

    vm.tower = tower;
    vm.authentication = Authentication;

  }
}());
