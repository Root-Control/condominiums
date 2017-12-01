(function () {
  'use strict';

  angular
    .module('bill_sale_details')
    .controller('Bill_sale_detailsController', Bill_sale_detailsController);

  Bill_sale_detailsController.$inject = ['$scope', 'bill_sale_detailResolve', 'Authentication'];

  function Bill_sale_detailsController($scope, bill_sale_detail, Authentication) {
    var vm = this;

    vm.bill_sale_detail = bill_sale_detail;
    vm.authentication = Authentication;

  }
}());
