(function () {
  'use strict';

  angular
    .module('departments.admin')
    .controller('DepartmentsAdminListController', DepartmentsAdminListController);

  DepartmentsAdminListController.$inject = ['DepartmentsService', 'Authentication', 'GroupsService', 'TowersService'];

  function DepartmentsAdminListController(DepartmentsService, Authentication, GroupsService, TowersService) {
    var vm = this;
    vm.authentication = Authentication;
    if (vm.authentication.user.roles[0] === 'superadmin') vm.groups = GroupsService.query();
    else vm.groups = GroupsService.query({ condominium: vm.authentication.user.condominium });

    vm.getTowersByGroup = function () {
      vm.towers = TowersService.query({ groupAssigned: vm.group._id });
      console.log(vm.towers);
    };

    vm.getDepartmentsByTower = function () {
      vm.departments = DepartmentsService.query({ tower: vm.tower._id });
      console.log(vm.departments);
    };
  }
}());
