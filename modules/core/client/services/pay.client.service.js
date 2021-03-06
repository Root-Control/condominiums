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
      if(!year) year = 2019;
      if(departmentId === null) query = '?month=' + month + '&year=' + year;
      else query = '?month=' + month + '&departmentId=' + departmentId + '&year=' + year;

      $http.get('/api/calculatepay' + query)
      .then(options.success, options.error);
    };

    me.getTotals = function(year, options) {
      var query = year ? '?year=' + year : '';
      $http.get('/api/gettotals' + query)
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

    me.paymentDetails = function(data, options) {
      var allmonths = '';
      var status = '';
      var year = '';
      var month = '';

      if(data.status) status = '&status=' + data.status;
      if(data.allmonths) allmonths = '&allmonths=' + data.allmonths;
      if(data.year) year = '&year=' + data.year;
      if(data.month) month = '&month=' + data.month;

      $http.get('/api/requestpaymentdata?code=' + data.code + status + allmonths + year + month)
        .then(options.success, options.error);
    };

    return {
      calculatePay: me.calculatePay,
      verifyContract: me.verifyUserContract,
      getTotals: me.getTotals,
      pay: me.pay,
      paymentDetails: me.paymentDetails
    };
  }
}());
