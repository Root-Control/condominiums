(function () {
  'use strict';

  angular
    .module('groups')
    .controller('GroupsController', GroupsController);

  GroupsController.$inject = ['$scope', 'groupResolve', 'Authentication', 'CondominiumsService'];

  function GroupsController($scope, group, Authentication, CondominiumsService) {
    var vm = this;

    vm.group = group;
    vm.authentication = Authentication;
    vm.condominiums = CondominiumsService.query();
  }
}());
