(function () {
  'use strict';

  angular
    .module('bill_sale_details')
    .controller('Bill_sale_detailsListController', Bill_sale_detailsListController);

  Bill_sale_detailsListController.$inject = ['Bill_sale_detailsService'];

  function Bill_sale_detailsListController(Bill_sale_detailsService) {
    var vm = this;

    vm.bill_sale_details = Bill_sale_detailsService.query();
  }
}());
