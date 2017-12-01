(function () {
  'use strict';

  angular
    .module('bill_sale_headers.admin')
    .controller('Bill_sale_headersAdminController', Bill_sale_headersAdminController);

  Bill_sale_headersAdminController.$inject = ['$scope', '$state', '$window', 'bill_sale_headerResolve', 'Authentication', 'Notification'];

  function Bill_sale_headersAdminController($scope, $state, $window, bill_sale_header, Authentication, Notification) {
    var vm = this;

    vm.bill_sale_header = bill_sale_header;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bill_sale_header
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.bill_sale_header.$remove(function () {
          $state.go('admin.bill_sale_headers.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bill_sale_header deleted successfully!' });
        });
      }
    }

    // Save Bill_sale_header
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bill_sale_headerForm');
        return false;
      }

      // Create a new bill_sale_header, or update the current instance
      vm.bill_sale_header.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.bill_sale_headers.list'); // should we send the User to the list or the updated Bill_sale_header's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bill_sale_header saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bill_sale_header save error!' });
      }
    }
  }
}());
