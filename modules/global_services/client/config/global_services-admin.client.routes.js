(function () {
  'use strict';

  angular
    .module('global_services.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.global_services', {
        abstract: true,
        url: '/global_services',
        template: '<ui-view/>'
      })
      .state('admin.global_services.list', {
        url: '',
        templateUrl: '/modules/global_services/client/views/admin/list-global_services.client.view.html',
        controller: 'Global_servicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.global_services.create', {
        url: '/create',
        templateUrl: '/modules/global_services/client/views/admin/form-global_service.client.view.html',
        controller: 'Global_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          global_serviceResolve: newGlobal_service
        }
      })
      .state('admin.global_services.edit', {
        url: '/:global_serviceId/edit',
        templateUrl: '/modules/global_services/client/views/admin/form-global_service.client.view.html',
        controller: 'Global_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ global_serviceResolve.title }}'
        },
        resolve: {
          global_serviceResolve: getGlobal_service
        }
      });
  }

  getGlobal_service.$inject = ['$stateParams', 'Global_servicesService'];

  function getGlobal_service($stateParams, Global_servicesService) {
    return Global_servicesService.get({
      global_serviceId: $stateParams.global_serviceId
    }).$promise;
  }

  newGlobal_service.$inject = ['Global_servicesService'];

  function newGlobal_service(Global_servicesService) {
    return new Global_servicesService();
  }
}());
