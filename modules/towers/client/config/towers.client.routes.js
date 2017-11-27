(function () {
  'use strict';

  angular
    .module('towers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('towers', {
        abstract: true,
        url: '/towers',
        template: '<ui-view/>'
      })
      .state('towers.list', {
        url: '',
        templateUrl: '/modules/towers/client/views/list-towers.client.view.html',
        controller: 'TowersListController',
        controllerAs: 'vm'
      })
      .state('towers.view', {
        url: '/:towerId',
        templateUrl: '/modules/towers/client/views/view-tower.client.view.html',
        controller: 'TowersController',
        controllerAs: 'vm',
        resolve: {
          towerResolve: getTower
        },
        data: {
          pageTitle: '{{ towerResolve.name }}'
        }
      });
  }

  getTower.$inject = ['$stateParams', 'TowersService'];

  function getTower($stateParams, TowersService) {
    return TowersService.get({
      towerId: $stateParams.towerId
    }).$promise;
  }
}());
