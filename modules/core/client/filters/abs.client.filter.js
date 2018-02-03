(function () {
  'use strict';

  angular
    .module('core')
    .filter('absolute', absolute);

  absolute.$inject = [];

  function absolute() {
    return function(num) {
      return Math.abs(num);
    }
  }

}());
