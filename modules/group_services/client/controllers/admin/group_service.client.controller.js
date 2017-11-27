(function () {
  'use strict';

  angular
    .module('group_services.admin')
    .controller('Group_ServicesAdminController', Group_ServicesAdminController);

  Group_ServicesAdminController.$inject = ['$scope', '$state', '$window', 'group_serviceResolve', 'Authentication', 'Notification'];

  function Group_ServicesAdminController($scope, $state, $window, group_service, Authentication, Notification) {
    var vm = this;

    vm.group_service = group_service;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Group_Service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.group_service.$remove(function () {
          $state.go('admin.group_services.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group_Service deleted successfully!' });
        });
      }
    }

    // Save Group_Service
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.group_serviceForm');
        return false;
      }

      // Create a new group_service, or update the current instance
      vm.group_service.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.group_services.list'); // should we send the User to the list or the updated Group_Service's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Group_Service saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Group_Service save error!' });
      }
    }
  }
}());
