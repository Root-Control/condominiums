(function () {
  'use strict';

  angular
    .module('bill_sale_details.services')
    .factory('Bill_sale_detailsService', Bill_sale_detailsService);

  Bill_sale_detailsService.$inject = ['$resource', '$log'];

  function Bill_sale_detailsService($resource, $log) {
    var Bill_sale_detail = $resource('/api/bill_sale_details/:bill_sale_detailId', {
      bill_sale_detailId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Bill_sale_detail.prototype, {
      createOrUpdate: function () {
        var bill_sale_detail = this;
        return createOrUpdate(bill_sale_detail);
      }
    });

    return Bill_sale_detail;

    function createOrUpdate(bill_sale_detail) {
      if (bill_sale_detail._id) {
        return bill_sale_detail.$update(onSuccess, onError);
      } else {
        return bill_sale_detail.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(bill_sale_detail) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
