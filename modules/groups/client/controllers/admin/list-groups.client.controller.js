(function () {
  'use strict';

  angular
    .module('groups.admin')
    .controller('GroupsAdminListController', GroupsAdminListController);

  GroupsAdminListController.$inject = ['GroupsService'];

  function GroupsAdminListController(GroupsService) {
    var vm = this;

    vm.groups = GroupsService.query();
  }
}());
