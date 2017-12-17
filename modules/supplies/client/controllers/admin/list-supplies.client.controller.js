(function () {
  'use strict';

  angular
    .module('supplies.admin')
    .controller('SuppliesAdminListController', SuppliesAdminListController);

  SuppliesAdminListController.$inject = ['SuppliesService'];

  function SuppliesAdminListController(SuppliesService) {
    var vm = this;

    vm.supplies = SuppliesService.query();
  }
}());
