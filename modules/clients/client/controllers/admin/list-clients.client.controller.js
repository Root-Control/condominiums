(function () {
  'use strict';

  angular
    .module('clients.admin')
    .controller('ClientsAdminListController', ClientsAdminListController);

  ClientsAdminListController.$inject = ['ClientsService'];

  function ClientsAdminListController(ClientsService) {
    var vm = this;

    vm.clients = ClientsService.query();
  }
}());
