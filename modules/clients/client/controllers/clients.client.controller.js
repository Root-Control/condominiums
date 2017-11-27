(function () {
  'use strict';

  angular
    .module('clients')
    .controller('ClientsController', ClientsController);

  ClientsController.$inject = ['$scope', 'clientResolve', 'Authentication'];

  function ClientsController($scope, client, Authentication) {
    var vm = this;

    vm.client = client;
    vm.authentication = Authentication;

  }
}());
