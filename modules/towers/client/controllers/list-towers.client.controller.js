(function () {
  'use strict';

  angular
    .module('towers')
    .controller('TowersListController', TowersListController);

  TowersListController.$inject = ['TowersService'];

  function TowersListController(TowersService) {
    var vm = this;

    vm.towers = TowersService.query();
  }
}());
