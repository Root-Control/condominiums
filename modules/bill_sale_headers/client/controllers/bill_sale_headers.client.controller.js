(function () {
  'use strict';

  angular
    .module('bill_sale_headers')
    .controller('Bill_sale_headersController', Bill_sale_headersController);

  Bill_sale_headersController.$inject = ['$scope', 'bill_sale_headerResolve', 'Authentication'];

  function Bill_sale_headersController($scope, bill_sale_header, Authentication) {
    var vm = this;

    vm.bill_sale_header = bill_sale_header;
    vm.authentication = Authentication;

  }
}());
