(function () {
  'use strict';

  angular
    .module('towers.admin')
    .controller('TowersAdminController', TowersAdminController);

  TowersAdminController.$inject = ['$scope', '$state', '$window', 'towerResolve', 'Authentication', 'Notification', 'GroupsService'];

  function TowersAdminController($scope, $state, $window, tower, Authentication, Notification, GroupsService) {
    var vm = this;

    vm.tower = tower;
    vm.groups = GroupsService.query();
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Remove existing Tower
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tower.$remove(function () {
          $state.go('admin.towers.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower deleted successfully!' });
        });
      }
    }

    // Save Tower
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.towerForm');
        return false;
      }

      // Create a new tower, or update the current instance
      vm.tower.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.towers.list'); // should we send the User to the list or the updated Tower's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tower save error!' });
      }
    }
  }
}());
