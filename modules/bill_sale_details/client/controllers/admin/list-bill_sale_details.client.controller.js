(function () {
  'use strict';

  angular
    .module('bill_sale_details.admin')
    .controller('Bill_sale_detailsAdminListController', Bill_sale_detailsAdminListController);

  Bill_sale_detailsAdminListController.$inject = ['Bill_sale_detailsService'];

  function Bill_sale_detailsAdminListController(Bill_sale_detailsService) {
    var vm = this;

    vm.bill_sale_details = Bill_sale_detailsService.query();
  }
}());
