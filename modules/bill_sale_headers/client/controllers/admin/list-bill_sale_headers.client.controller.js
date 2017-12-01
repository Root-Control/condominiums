(function () {
  'use strict';

  angular
    .module('bill_sale_headers.admin')
    .controller('Bill_sale_headersAdminListController', Bill_sale_headersAdminListController);

  Bill_sale_headersAdminListController.$inject = ['Bill_sale_headersService'];

  function Bill_sale_headersAdminListController(Bill_sale_headersService) {
    var vm = this;

    vm.bill_sale_headers = Bill_sale_headersService.query();
  }
}());
