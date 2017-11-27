(function () {
  'use strict';

  angular
    .module('department_services.admin')
    .controller('Department_servicesAdminController', Department_servicesAdminController);

  Department_servicesAdminController.$inject = ['$scope', '$state', '$window', 'department_serviceResolve', 'Authentication', 'Notification'];

  function Department_servicesAdminController($scope, $state, $window, department_service, Authentication, Notification) {
    var vm = this;

    vm.department_service = department_service;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Department_service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.department_service.$remove(function () {
          $state.go('admin.department_services.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department_service deleted successfully!' });
        });
      }
    }

    // Save Department_service
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.department_serviceForm');
        return false;
      }

      // Create a new department_service, or update the current instance
      vm.department_service.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.department_services.list'); // should we send the User to the list or the updated Department_service's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department_service saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Department_service save error!' });
      }
    }
  }
}());
