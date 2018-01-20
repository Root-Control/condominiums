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
      if(!year) year = 2018;
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
      console.log(data);
      if(data.status) status = '&status=' + data.status;
      if(data.allmonths) allmonths = '&allmonths=' + data.allmonths;

      $http.get('/api/requestpaymentdata?code=' + data.code + status + allmonths)
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
