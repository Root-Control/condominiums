(function () {
  'use strict';

  angular
    .module('services.admin')
    .controller('ServicesAdminController', ServicesAdminController);

  ServicesAdminController.$inject = ['$scope', '$state', '$window', 'serviceResolve', 'Authentication', 'Notification', 'CondominiumsService'];

  function ServicesAdminController($scope, $state, $window, service, Authentication, Notification, CondominiumsService) {
    var vm = this;

    vm.service = service;
    vm.authentication = Authentication;
    if (vm.authentication.user.roles[0] === 'superadmin') vm.condominiums = CondominiumsService.query();

    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Remove existing Service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.service.$remove(function () {
          $state.go('admin.services.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Service deleted successfully!' });
        });
      }
    }

    // Save Service
    function save(isValid) {
      if (vm.authentication.user.roles[0] === 'c-admin') vm.service.condominium = vm.authentication.user.condominium;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceForm');
        return false;
      }

      // Create a new service, or update the current instance
      vm.service.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.services.list'); // should we send the User to the list or the updated Service's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Service saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Service save error!' });
      }
    }
  }
}());
