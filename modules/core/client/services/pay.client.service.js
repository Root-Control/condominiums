(function () {
  'use strict';

  angular
    .module('core')
    .factory('Pay', Pay);

  Pay.$inject = ['$http'];

  function Pay($http) {
    var me = this;
    me.calculatePay = function(month, options) {
      $http.get('/api/calculatepay?month=' + month)
      .then(options.success, options.error);
    };

    me.verifyUserContract = function(options) {
      $http.get('/api/agreements/verify')
      .then(options.success, options.error);
    };
    return {
      calculatePay: me.calculatePay,
      verifyContract: me.verifyUserContract
    }
  }
}());
