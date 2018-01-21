(function () {
  'use strict';

  angular
    .module('core')
    .filter('serviceType', serviceType);

  serviceType.$inject = [];

  function serviceType() {
    return function(service) {
      switch(service) {
        case 1:
          return 'Global';
        break;
        case 2:
          return 'Grupal';
        break;
        case 3:
          return 'Torre';
        break;
        case 4:
          return 'Individual';
        break;
        case 5:
          return 'Personal de condominio';
        break;            
      }
    }
  }

}());
