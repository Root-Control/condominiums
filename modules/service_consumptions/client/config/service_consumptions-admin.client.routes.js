(function () {
  'use strict';

  angular
    .module('service_consumptions.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.service_consumptions', {
        abstract: true,
        url: '/service_consumptions',
        template: '<ui-view/>'
      })
      .state('admin.service_consumptions.list', {
        url: '',
        templateUrl: '/modules/service_consumptions/client/views/admin/list-service_consumptions.client.view.html',
        controller: 'Service_consumptionsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.service_consumptions.create', {
        url: '/create',
        templateUrl: '/modules/service_consumptions/client/views/admin/form-service_consumption.client.view.html',
        controller: 'Service_consumptionsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          service_consumptionResolve: newService_consumption
        }
      })
      .state('admin.service_consumptions.edit', {
        url: '/:service_consumptionId/edit',
        templateUrl: '/modules/service_consumptions/client/views/admin/form-service_consumption.client.view.html',
        controller: 'Service_consumptionsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ service_consumptionResolve.title }}'
        },
        resolve: {
          service_consumptionResolve: getService_consumption
        }
      });
  }

  getService_consumption.$inject = ['$stateParams', 'Service_consumptionsService'];

  function getService_consumption($stateParams, Service_consumptionsService) {
    return Service_consumptionsService.get({
      service_consumptionId: $stateParams.service_consumptionId
    }).$promise;
  }

  newService_consumption.$inject = ['Service_consumptionsService'];

  function newService_consumption(Service_consumptionsService) {
    return new Service_consumptionsService();
  }
}());
