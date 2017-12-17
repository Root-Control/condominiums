(function () {
  'use strict';

  angular
    .module('supplies')
    .controller('SuppliesListController', SuppliesListController);

  SuppliesListController.$inject = ['SuppliesService'];

  function SuppliesListController(SuppliesService) {
    var vm = this;

    vm.supplies = SuppliesService.query();
  }
}());
