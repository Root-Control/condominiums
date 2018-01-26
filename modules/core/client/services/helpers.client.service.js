(function () {
  'use strict';

  angular
    .module('core')
    .factory('Helpers', Helpers);

  Helpers.$inject = ['$http'];

  function Helpers($http) {
    var me = this;
    me.getMonths = function() {
     var months = [];
     months.push({ name: 'Enero', value: 1 }, { name: 'Febrero', value: 2 });
     months.push({ name: 'Marzo', value: 3 }, { name: 'Abril', value: 4 });
     months.push({ name: 'Mayo', value: 5 }, { name: 'Junio', value: 6 });
     months.push({ name: 'Julio', value: 7 }, { name: 'Agosto', value: 8 });
     months.push({ name: 'Setiembre', value: 9 }, { name: 'Octubre', value: 10 });
     months.push({ name: 'Noviembre', value: 11 }, { name: 'Diciembre', value: 12 });
     return months;      
    }

    return {
      getMonths: me.getMonths,
    };
  }
}());
