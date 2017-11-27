(function () {
  'use strict';

  angular
    .module('clients.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.clients', {
        abstract: true,
        url: '/clients',
        template: '<ui-view/>'
      })
      .state('admin.clients.list', {
        url: '',
        templateUrl: '/modules/clients/client/views/admin/list-clients.client.view.html',
        controller: 'ClientsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.clients.create', {
        url: '/create',
        templateUrl: '/modules/clients/client/views/admin/form-client.client.view.html',
        controller: 'ClientsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          clientResolve: newClient
        }
      })
      .state('admin.clients.edit', {
        url: '/:clientId/edit',
        templateUrl: '/modules/clients/client/views/admin/form-client.client.view.html',
        controller: 'ClientsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ clientResolve.title }}'
        },
        resolve: {
          clientResolve: getClient
        }
      });
  }

  getClient.$inject = ['$stateParams', 'ClientsService'];

  function getClient($stateParams, ClientsService) {
    return ClientsService.get({
      clientId: $stateParams.clientId
    }).$promise;
  }

  newClient.$inject = ['ClientsService'];

  function newClient(ClientsService) {
    return new ClientsService();
  }
}());
