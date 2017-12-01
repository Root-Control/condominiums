(function () {
  'use strict';

  angular
    .module('bill_sale_headers')
    .controller('Bill_sale_headersListController', Bill_sale_headersListController);

  Bill_sale_headersListController.$inject = ['Bill_sale_headersService'];

  function Bill_sale_headersListController(Bill_sale_headersService) {
    var vm = this;

    vm.bill_sale_headers = Bill_sale_headersService.query();
  }
}());
