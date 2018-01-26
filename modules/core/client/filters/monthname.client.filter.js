(function () {
  'use strict';

  angular
    .module('core')
    .filter('monthName', monthName);

  monthName.$inject = [];

  function monthName() {
    return function(month) {
      month = parseInt(month, 10);
      switch(month) {
        case 1:
          return 'Enero';
        break;
        case 2:
          return 'Febrero';
        break;
        case 3:
          return 'Marzo';
        break;
        case 4:
          return 'Abril';
        break;
        case 5:
          return 'Mayo';
        break;
        case 6:
          return 'Junio';
        break;
        case 7:
          return 'Julio';
        break;
        case 8:
          return 'Agosto';
        break; 
        case 9:
          return 'Setiembre';
        break;
        case 10:
          return 'Octubre';
        break;
        case 11:
          return 'Noviembre';
        break;
        case 12:
          return 'Diciembre';
        break;                
      }
    }
  }

}());
