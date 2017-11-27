(function () {
  'use strict';

  angular
    .module('department_services.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.department_services', {
        abstract: true,
        url: '/department_services',
        template: '<ui-view/>'
      })
      .state('admin.department_services.list', {
        url: '',
        templateUrl: '/modules/department_services/client/views/admin/list-department_services.client.view.html',
        controller: 'Department_servicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.department_services.create', {
        url: '/create',
        templateUrl: '/modules/department_services/client/views/admin/form-department_service.client.view.html',
        controller: 'Department_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          department_serviceResolve: newDepartment_service
        }
      })
      .state('admin.department_services.edit', {
        url: '/:department_serviceId/edit',
        templateUrl: '/modules/department_services/client/views/admin/form-department_service.client.view.html',
        controller: 'Department_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ department_serviceResolve.title }}'
        },
        resolve: {
          department_serviceResolve: getDepartment_service
        }
      });
  }

  getDepartment_service.$inject = ['$stateParams', 'Department_servicesService'];

  function getDepartment_service($stateParams, Department_servicesService) {
    return Department_servicesService.get({
      department_serviceId: $stateParams.department_serviceId
    }).$promise;
  }

  newDepartment_service.$inject = ['Department_servicesService'];

  function newDepartment_service(Department_servicesService) {
    return new Department_servicesService();
  }
}());
