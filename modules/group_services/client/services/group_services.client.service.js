(function () {
  'use strict';

  angular
    .module('group_services.services')
    .factory('Group_ServicesService', Group_ServicesService);

  Group_ServicesService.$inject = ['$resource', '$log'];

  function Group_ServicesService($resource, $log) {
    var Group_Service = $resource('/api/group_services/:group_serviceId', {
      group_serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Group_Service.prototype, {
      createOrUpdate: function () {
        var group_service = this;
        return createOrUpdate(group_service);
      }
    });

    return Group_Service;

    function createOrUpdate(group_service) {
      if (group_service._id) {
        return group_service.$update(onSuccess, onError);
      } else {
        return group_service.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(group_service) {
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
