(function () {
  'use strict';

  angular
    .module('core')
    .factory('Pay', Pay);

  Pay.$inject = ['$http'];

  function Pay($http) {
    var me = this;
    me.calculatePay = function(month, year, departmentId, options) {
      var query;
      if(!year) year = 2017;
      if(departmentId === null) query = '?month=' + month + '&year=' + year;
      else query = '?month=' + month + '&departmentId=' + departmentId + '&year=' + year;

      $http.get('/api/calculatepay' + query)
      .then(options.success, options.error);
    };

    me.getTotals = function(options) {
      $http.get('/api/gettotals')
        .then(options.success, options.error);
    };

    me.verifyUserContract = function(options) {
      $http.get('/api/agreements/verify')
      .then(options.success, options.error);
    };

    me.pay = function(data, options) {
      $http.put('/api/custom_bill_sale_headers/updatestatus', data)
        .then(options.success, options.error);
    };
    return {
      calculatePay: me.calculatePay,
      verifyContract: me.verifyUserContract,
      getTotals: me.getTotals,
      pay: me.pay
    };
  }
}());