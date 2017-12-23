(function () {
  'use strict';

  angular
    .module('towers.admin')
    .controller('TowersAdminListController', TowersAdminListController);

  TowersAdminListController.$inject = ['TowersService', 'Authentication'];

  function TowersAdminListController(TowersService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user.roles[0] === 'superadmin') vm.towers = TowersService.query();
    else vm.towers = TowersService.query({ condominiumId: vm.authentication.user.condominium });
    console.log(vm.towers);
  }
}());
