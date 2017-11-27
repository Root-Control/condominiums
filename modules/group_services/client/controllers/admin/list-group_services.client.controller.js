(function () {
  'use strict';

  angular
    .module('group_services.admin')
    .controller('Group_ServicesAdminListController', Group_ServicesAdminListController);

  Group_ServicesAdminListController.$inject = ['Group_ServicesService'];

  function Group_ServicesAdminListController(Group_ServicesService) {
    var vm = this;

    vm.group_services = Group_ServicesService.query();
  }
}());
