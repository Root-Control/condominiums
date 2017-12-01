(function () {
  'use strict';

  angular
    .module('bill_sale_details.admin')
    .controller('Bill_sale_detailsAdminController', Bill_sale_detailsAdminController);

  Bill_sale_detailsAdminController.$inject = ['$scope', '$state', '$window', 'bill_sale_detailResolve', 'Authentication', 'Notification'];

  function Bill_sale_detailsAdminController($scope, $state, $window, bill_sale_detail, Authentication, Notification) {
    var vm = this;

    vm.bill_sale_detail = bill_sale_detail;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bill_sale_detail
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.bill_sale_detail.$remove(function () {
          $state.go('admin.bill_sale_details.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bill_sale_detail deleted successfully!' });
        });
      }
    }

    // Save Bill_sale_detail
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bill_sale_detailForm');
        return false;
      }

      // Create a new bill_sale_detail, or update the current instance
      vm.bill_sale_detail.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.bill_sale_details.list'); // should we send the User to the list or the updated Bill_sale_detail's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bill_sale_detail saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bill_sale_detail save error!' });
      }
    }
  }
}());
