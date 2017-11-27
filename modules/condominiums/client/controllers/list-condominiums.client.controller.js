(function () {
  'use strict';

  angular
    .module('condominiums')
    .controller('CondominiumsListController', CondominiumsListController);

  CondominiumsListController.$inject = ['CondominiumsService'];

  function CondominiumsListController(CondominiumsService) {
    var vm = this;

    vm.condominiums = CondominiumsService.query();
  }
}());
