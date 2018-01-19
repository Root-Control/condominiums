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
          if (vm.contract) vm.getTotals();
        },
        error: function(err) {
          console.log(err);
        }
      });       
    };

    vm.getTotals = function() {
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
      vm.individuals = {};
      vm.towerServices = [];
      vm.personalServices = [];
      vm.groupServices = [];
      vm.globalServices = [];
      Pay.calculatePay(month, 2018, null, {
        success: function(response) {
          vm.information = response.data.informative;
          vm.lastConsume = response.data.lastConsume;
          vm.avgWaterSupply = response.data.avgWaterSupply;
          vm.department = response.data.department;
          vm.items = response.data.details;
          vm.total = response.data.total;

          vm.items.forEach(function(key) {
            switch(key.type) {
              case 1:
                vm.globalServices.push(key);
              break;
              case 2:
                vm.groupServices.push(key);
              break;
              case 3:
                vm.towerServices.push(key);
              break;
              case 4:
                vm.individuals = key;
              break;
              case 5:
                vm.personalServices.push(key);
              break;
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

    vm.print = function() {
      vm.printElement(document.getElementById("printable"));
      window.print();
    };

    vm.printElement = function(elem, append, delimiter) {
      var domClone = elem.cloneNode(true);

      var printSection = document.getElementById("printSection");

      if (!printSection) {
          var printSection = document.createElement("div");
          printSection.id = "printSection";
          document.body.appendChild(printSection);
      }

      if (append !== true) {
          printSection.innerHTML = "";
      }

      else if (append === true) {
          if (typeof(delimiter) === "string") {
              printSection.innerHTML += delimiter;
          }
          else if (typeof(delimiter) === "object") {
              printSection.appendChlid(delimiter);
          }
      }

      printSection.appendChild(domClone);
    };

    if(vm.authentication.user && vm.authentication.user.roles == 'user') vm.chargeMonths();
    if(vm.authentication.user && vm.authentication.user.roles == 'admin' || vm.authentication.user.roles == 'c-admin') $state.go('dashboard');
  }
}());
