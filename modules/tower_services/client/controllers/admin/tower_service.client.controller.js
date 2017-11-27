(function () {
  'use strict';

  angular
    .module('tower_services.admin')
    .controller('Tower_servicesAdminController', Tower_servicesAdminController);

  Tower_servicesAdminController.$inject = ['$scope', '$state', '$window', 'tower_serviceResolve', 'Authentication', 'Notification'];

  function Tower_servicesAdminController($scope, $state, $window, tower_service, Authentication, Notification) {
    var vm = this;

    vm.tower_service = tower_service;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tower_service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tower_service.$remove(function () {
          $state.go('admin.tower_services.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower_service deleted successfully!' });
        });
      }
    }

    // Save Tower_service
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tower_serviceForm');
        return false;
      }

      // Create a new tower_service, or update the current instance
      vm.tower_service.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tower_services.list'); // should we send the User to the list or the updated Tower_service's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tower_service saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tower_service save error!' });
      }
    }
  }
}());
