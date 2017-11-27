(function () {
  'use strict';

  angular
    .module('condominiums.admin')
    .controller('CondominiumsAdminListController', CondominiumsAdminListController);

  CondominiumsAdminListController.$inject = ['CondominiumsService'];

  function CondominiumsAdminListController(CondominiumsService) {
    var vm = this;

    vm.condominiums = CondominiumsService.query();
  }
}());
