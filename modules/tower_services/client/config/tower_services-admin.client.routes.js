(function () {
  'use strict';

  angular
    .module('tower_services.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tower_services', {
        abstract: true,
        url: '/tower_services',
        template: '<ui-view/>'
      })
      .state('admin.tower_services.list', {
        url: '',
        templateUrl: '/modules/tower_services/client/views/admin/list-tower_services.client.view.html',
        controller: 'Tower_servicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.tower_services.create', {
        url: '/create',
        templateUrl: '/modules/tower_services/client/views/admin/form-tower_service.client.view.html',
        controller: 'Tower_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          tower_serviceResolve: newTower_service
        }
      })
      .state('admin.tower_services.edit', {
        url: '/:tower_serviceId/edit',
        templateUrl: '/modules/tower_services/client/views/admin/form-tower_service.client.view.html',
        controller: 'Tower_servicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ tower_serviceResolve.title }}'
        },
        resolve: {
          tower_serviceResolve: getTower_service
        }
      });
  }

  getTower_service.$inject = ['$stateParams', 'Tower_servicesService'];

  function getTower_service($stateParams, Tower_servicesService) {
    return Tower_servicesService.get({
      tower_serviceId: $stateParams.tower_serviceId
    }).$promise;
  }

  newTower_service.$inject = ['Tower_servicesService'];

  function newTower_service(Tower_servicesService) {
    return new Tower_servicesService();
  }
}());
