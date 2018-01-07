(function () {
  'use strict';

  angular
    .module('configurations.admin')
    .controller('ConfigurationsAdminController', ConfigurationsAdminController);

  ConfigurationsAdminController.$inject = ['$scope', '$state', '$window', 'configurationResolve', 'Authentication', 'Notification'];

  function ConfigurationsAdminController($scope, $state, $window, configuration, Authentication, Notification) {
    var vm = this;

    vm.configuration = configuration;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Configuration
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.configuration.$remove(function () {
          $state.go('admin.configurations.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Configuration deleted successfully!' });
        });
      }
    }

    // Save Configuration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.configurationForm');
        return false;
      }

      // Create a new configuration, or update the current instance
      vm.configuration.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.configurations.list'); // should we send the User to the list or the updated Configuration's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Configuration saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Configuration save error!' });
      }
    }
  }
}());
