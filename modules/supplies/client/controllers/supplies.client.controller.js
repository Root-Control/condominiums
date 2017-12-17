(function () {
  'use strict';

  angular
    .module('supplies')
    .controller('SuppliesController', SuppliesController);

  SuppliesController.$inject = ['$scope', 'supplieResolve', 'Authentication'];

  function SuppliesController($scope, supplie, Authentication) {
    var vm = this;

    vm.supplie = supplie;
    vm.authentication = Authentication;

  }
}());
