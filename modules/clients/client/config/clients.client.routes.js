(function () {
  'use strict';

  angular
    .module('clients.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clients', {
        abstract: true,
        url: '/clients',
        template: '<ui-view/>'
      })
      .state('clients.list', {
        url: '',
        templateUrl: '/modules/clients/client/views/list-clients.client.view.html',
        controller: 'ClientsListController',
        controllerAs: 'vm'
      })
      .state('clients.view', {
        url: '/:clientId',
        templateUrl: '/modules/clients/client/views/view-client.client.view.html',
        controller: 'ClientsController',
        controllerAs: 'vm',
        resolve: {
          clientResolve: getClient
        },
        data: {
          pageTitle: '{{ clientResolve.name }}'
        }
      });
  }

  getClient.$inject = ['$stateParams', 'ClientsService'];

  function getClient($stateParams, ClientsService) {
    return ClientsService.get({
      clientId: $stateParams.clientId
    }).$promise;
  }
}());
