(function () {
  'use strict';

  angular
    .module('groups.admin')
    .controller('GroupsAdminListController', GroupsAdminListController);

  GroupsAdminListController.$inject = ['GroupsService', 'Authentication'];

  function GroupsAdminListController(GroupsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    if(vm.authentication.user.roles[0] === 'superadmin') vm.groups = GroupsService.query();
    else vm.groups = GroupsService.query({ condominium: vm.authentication.user.condominium });
  }
}());
