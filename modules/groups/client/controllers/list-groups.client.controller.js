(function () {
  'use strict';

  angular
    .module('groups')
    .controller('GroupsListController', GroupsListController);

  GroupsListController.$inject = ['GroupsService'];

  function GroupsListController(GroupsService) {
    var vm = this;

    vm.groups = GroupsService.query();
  }
}());
