(function () {
  'use strict';

  angular
    .module('global_services.admin')
    .controller('Global_servicesAdminController', Global_servicesAdminController);

  Global_servicesAdminController.$inject = ['$scope', '$state', '$window', 'global_serviceResolve', 'Authentication', 'Notification'];

  function Global_servicesAdminController($scope, $state, $window, global_service, Authentication, Notification) {
    var vm = this;

    vm.global_service = global_service;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Global_service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.global_service.$remove(function () {
          $state.go('admin.global_services.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Global_service deleted successfully!' });
        });
      }
    }

    // Save Global_service
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.global_serviceForm');
        return false;
      }

      // Create a new global_service, or update the current instance
      vm.global_service.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.global_services.list'); // should we send the User to the list or the updated Global_service's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Global_service saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Global_service save error!' });
      }
    }
  }
}());
