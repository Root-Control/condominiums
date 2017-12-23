(function () {
  'use strict';

  angular
    .module('departments.admin')
    .controller('DepartmentsAdminController', DepartmentsAdminController);

  DepartmentsAdminController.$inject = ['$scope', '$state', '$window', 'departmentResolve', 'Authentication', 'Notification', 'TowersService'];

  function DepartmentsAdminController($scope, $state, $window, department, Authentication, Notification, TowersService) {
    var vm = this;

    vm.department = department;
    vm.authentication = Authentication;
    if (vm.authentication.user.roles[0] === 'superadmin') vm.towers = TowersService.query();
    else vm.towers = TowersService.query({ condominiumId: vm.authentication.user.condominium }); 
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Department
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.department.$remove(function () {
          $state.go('admin.departments.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
        });
      }
    }

    // Save Department
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.departmentForm');
        return false;
      }

      // Create a new department, or update the current instance
      vm.department.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.departments.list'); // should we send the User to the list or the updated Department's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Department save error!' });
      }
    }
  }
}());
