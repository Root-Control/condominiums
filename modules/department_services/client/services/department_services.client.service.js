(function () {
  'use strict';

  angular
    .module('department_services.services')
    .factory('Department_servicesService', Department_servicesService);

  Department_servicesService.$inject = ['$resource', '$log'];

  function Department_servicesService($resource, $log) {
    var Department_service = $resource('/api/department_services/:department_serviceId', {
      department_serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Department_service.prototype, {
      createOrUpdate: function () {
        var department_service = this;
        return createOrUpdate(department_service);
      }
    });

    return Department_service;

    function createOrUpdate(department_service) {
      if (department_service._id) {
        return department_service.$update(onSuccess, onError);
      } else {
        return department_service.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(department_service) {
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
