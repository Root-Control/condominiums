(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

 HomeController.$inject = ['$scope', '$state', 'Authentication', 'Pay'];

  function HomeController($scope, $state, Authentication, Pay) {
    var vm = this;
    vm.authentication = Authentication;
    vm.contract = true;

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

      Pay.getTotals({
        success: function(response) {
          vm.userData = true;
          vm.months = response.data;
        },
        error: function(err) {

        }
      });
    };

    vm.createBillHeader = function(name, month) {
      vm.monthSelected = name;
      vm.department = [];
      vm.items = [];
      vm.user = [];
      vm.head = [];
      vm.individuals = [];
      Pay.calculatePay(month, 2017, null, {
        success: function(response) {
          vm.department = response.data.department;
          vm.items = response.data.details;
          vm.total = response.data.total;

          vm.items.forEach(function(key) {
            if(key.type === 4) {
              vm.individuals.push(key);
              vm.items.splice(key, 1);
            }
          });

          vm.user = response.data.fullUser;
          vm.head = response.data.header;
        },
        error: function(err) {
          console.log(err);
        }
      });
    };


    if(vm.authentication.user && vm.authentication.user.roles == 'user') vm.chargeMonths();
  }
}());
