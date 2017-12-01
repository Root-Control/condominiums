(function () {
  'use strict';

  angular
    .module('bill_sale_headers.services')
    .factory('Bill_sale_headersService', Bill_sale_headersService);

  Bill_sale_headersService.$inject = ['$resource', '$log'];

  function Bill_sale_headersService($resource, $log) {
    var Bill_sale_header = $resource('/api/bill_sale_headers/:bill_sale_headerId', {
      bill_sale_headerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Bill_sale_header.prototype, {
      createOrUpdate: function () {
        var bill_sale_header = this;
        return createOrUpdate(bill_sale_header);
      }
    });

    return Bill_sale_header;

    function createOrUpdate(bill_sale_header) {
      if (bill_sale_header._id) {
        return bill_sale_header.$update(onSuccess, onError);
      } else {
        return bill_sale_header.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(bill_sale_header) {
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
