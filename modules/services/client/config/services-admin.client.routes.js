(function () {
  'use strict';

  angular
    .module('services.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.services', {
        abstract: true,
        url: '/services',
        template: '<ui-view/>'
      })
      .state('admin.services.list', {
        url: '',
        templateUrl: '/modules/services/client/views/admin/list-services.client.view.html',
        controller: 'ServicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.services.create', {
        url: '/create',
        templateUrl: '/modules/services/client/views/admin/form-service.client.view.html',
        controller: 'ServicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          serviceResolve: newService
        }
      })
      .state('admin.services.edit', {
        url: '/:serviceId/edit',
        templateUrl: '/modules/services/client/views/admin/form-service.client.view.html',
        controller: 'ServicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ serviceResolve.title }}'
        },
        resolve: {
          serviceResolve: getService
        }
      });
  }

  getService.$inject = ['$stateParams', 'ServicesService'];

  function getService($stateParams, ServicesService) {
    return ServicesService.get({
      serviceId: $stateParams.serviceId
    }).$promise;
  }

  newService.$inject = ['ServicesService'];

  function newService(ServicesService) {
    return new ServicesService();
  }
}());
