(function () {
  'use strict';

  angular
    .module('core')
    .controller('AquaController', AquaController);

  AquaController.$inject = ['$window', '$scope', '$state', 'Authentication', 'Messages', 'TowersService', 'Helpers', 'Consumption'];

  function AquaController($window, $scope, $state, Authentication, Messages, TowersService, Helpers, Consumption) {
    var vm = this;
    vm.authentication = Authentication;
	vm.years = [{ text: 2014, value: 2014 }, { text: 2015, value: 2015 }, { text: 2016, value: 2016 }, { text: 2017, value: 2017 }, { text: 2018, value: 2018 } ];
    vm.selectedYear = 2018;
    vm.selectedTowerName = 'Seleccionar';

    vm.towers = TowersService.query({ active: true });

    vm.selectTower = function(item) {
    	vm.selectedTowerName = item.name;
    	vm.selectedTower = item._id;
    };

    vm.validateFields = function() {
    	if(!vm.selectedMonth) {
			alert('Selecciona un mes'); 
			return false;
    	}
    	if(!vm.selectedTower) {
    		alert('Selecciona una torre'); 
    		return false;
    	}

    	vm.data = {
    		towerId: vm.selectedTower,
    		month: parseInt(vm.selectedMonth, 10),
    		year: parseInt(vm.selectedYear, 10)
    	};
    	vm.getConsumptions(vm.data);
    };

    vm.getConsumptions = function(data) {
    	Consumption.getAquaConsumptionsByTower(data, {
    		success: function(response) {
    			console.log(response.data);
    			vm.consumptions = response.data;
    		},
    		error: function(err) {
    			console.log(err);
    		}
    	});
    };

    vm.months = Helpers.getMonths();
  }
}());
