(function () {
  'use strict';

  angular
    .module('supplies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('supplies', {
        abstract: true,
        url: '/supplies',
        template: '<ui-view/>'
      })
      .state('supplies.list', {
        url: '',
        templateUrl: '/modules/supplies/client/views/list-supplies.client.view.html',
        controller: 'SuppliesListController',
        controllerAs: 'vm'
      })
      .state('supplies.view', {
        url: '/:supplieId',
        templateUrl: '/modules/supplies/client/views/view-supplie.client.view.html',
        controller: 'SuppliesController',
        controllerAs: 'vm',
        resolve: {
          supplieResolve: getSupplie
        },
        data: {
          pageTitle: '{{ supplieResolve.title }}'
        }
      });
  }

  getSupplie.$inject = ['$stateParams', 'SuppliesService'];

  function getSupplie($stateParams, SuppliesService) {
    return SuppliesService.get({
      supplieId: $stateParams.supplieId
    }).$promise;
  }
}());
