(function () {
  'use strict';

  angular
    .module('groups.admin')
    .controller('GroupsAdminController', GroupsAdminController);

  GroupsAdminController.$inject = ['$scope', '$state', '$window', 'groupResolve', 'Authentication', 'Notification', 'CondominiumsService'];

  function GroupsAdminController($scope, $state, $window, group, Authentication, Notification, CondominiumsService) {
    var vm = this;

    vm.group = group;
    vm.condominiums = CondominiumsService.query();
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Group
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.group.$remove(function () {
          $state.go('admin.groups.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group deleted successfully!' });
        });
      }
    }

    // Save Group
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.groupForm');
        return false;
      }

      // Create a new group, or update the current instance
      vm.group.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.groups.list'); // should we send the User to the list or the updated Group's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Group save error!' });
      }
    }
  }
}());
