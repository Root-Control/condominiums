(function () {
  'use strict';

  angular
    .module('condominiums.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('condominiums', {
        abstract: true,
        url: '/condominiums',
        template: '<ui-view/>'
      })
      .state('condominiums.list', {
        url: '',
        templateUrl: '/modules/condominiums/client/views/list-condominiums.client.view.html',
        controller: 'CondominiumsListController',
        controllerAs: 'vm'
      })
      .state('condominiums.view', {
        url: '/:condominiumId',
        templateUrl: '/modules/condominiums/client/views/view-condominium.client.view.html',
        controller: 'CondominiumsController',
        controllerAs: 'vm',
        resolve: {
          condominiumResolve: getCondominium
        },
        data: {
          pageTitle: '{{ condominiumResolve.name }}'
        }
      });
  }

  getCondominium.$inject = ['$stateParams', 'CondominiumsService'];

  function getCondominium($stateParams, CondominiumsService) {
    return CondominiumsService.get({
      condominiumId: $stateParams.condominiumId
    }).$promise;
  }
}());
