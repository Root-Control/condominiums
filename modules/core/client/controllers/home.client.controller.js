(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

 HomeController.$inject = ['$scope', '$state', 'Authentication', 'Pay'];

  function HomeController($scope, $state, Authentication, Pay) {
    var vm = this;
    vm.authentication = Authentication;
    vm.contract = false;
    console.log(vm.authentication);

    vm.chargeMonths = function() {
      Pay.verifyContract({
        success: function(response) {
          vm.contract = response.data.exists;
          console.log(vm.contract);
        },
        error: function(err) {
          console.log(err);
        }
      });

      vm.months = [];
      vm.userData = true;
      vm.months.push({ month: 1, name: 'Enero' });
      vm.months.push({ month: 2, name: 'Febrero' });
      vm.months.push({ month: 3, name: 'Marzo' });
      vm.months.push({ month: 4, name: 'Abril' });
      vm.months.push({ month: 5, name: 'Mayo' });
      vm.months.push({ month: 6, name: 'Junio' });
      vm.months.push({ month: 7, name: 'Julio' });
      vm.months.push({ month: 8, name: 'Agosto' });
      vm.months.push({ month: 9, name: 'Setiembre' });
      vm.months.push({ month: 10, name: 'Octubre' });
      vm.months.push({ month: 11, name: 'Noviembre' });
      vm.months.push({ month: 12, name: 'Diciembre' });
    };



    vm.createBillHeader = function(name, month) {
      vm.monthSelected = name;
      vm.department = [];
      vm.items = [];
      vm.user = [];
      vm.head = [];
      Pay.calculatePay(month, {
        success: function(response) {
          vm.department = response.data.department;
          vm.items = response.data.details;
          vm.user = response.data.fullUser;
          vm.head = response.data.header;
          console.log(response.data);
        },
        error: function(err) {
          console.log(err);
        }
      });
    };


    if(vm.authentication.user && vm.authentication.user.roles == 'user') vm.chargeMonths();
  }
}());
