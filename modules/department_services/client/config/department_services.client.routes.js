(function () {
  'use strict';

  angular
    .module('department_services.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('department_services', {
        abstract: true,
        url: '/department_services',
        template: '<ui-view/>'
      })
      .state('department_services.list', {
        url: '',
        templateUrl: '/modules/department_services/client/views/list-department_services.client.view.html',
        controller: 'Department_servicesListController',
        controllerAs: 'vm'
      })
      .state('department_services.view', {
        url: '/:department_serviceId',
        templateUrl: '/modules/department_services/client/views/view-department_service.client.view.html',
        controller: 'Department_servicesController',
        controllerAs: 'vm',
        resolve: {
          department_serviceResolve: getDepartment_service
        },
        data: {
          pageTitle: '{{ department_serviceResolve.title }}'
        }
      });
  }

  getDepartment_service.$inject = ['$stateParams', 'Department_servicesService'];

  function getDepartment_service($stateParams, Department_servicesService) {
    return Department_servicesService.get({
      department_serviceId: $stateParams.department_serviceId
    }).$promise;
  }
}());
