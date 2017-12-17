(function () {
  'use strict';

  angular
    .module('service_consumptions.services')
    .factory('CustomSupply', CustomSupply);

  CustomSupply.$inject = ['$http'];

  function CustomSupply($http) {

  }
}());
