(function () {
  'use strict';

  angular
    .module('group_services')
    .controller('Group_ServicesListController', Group_ServicesListController);

  Group_ServicesListController.$inject = ['Group_ServicesService'];

  function Group_ServicesListController(Group_ServicesService) {
    var vm = this;

    vm.group_services = Group_ServicesService.query();
  }
}());
