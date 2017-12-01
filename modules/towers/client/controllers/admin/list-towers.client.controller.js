(function () {
  'use strict';

  angular
    .module('towers.admin')
    .controller('TowersAdminListController', TowersAdminListController);

  TowersAdminListController.$inject = ['TowersService'];

  function TowersAdminListController(TowersService) {
    var vm = this;
    vm.towers = TowersService.query();
    console.log(vm.towers);
  }
}());
