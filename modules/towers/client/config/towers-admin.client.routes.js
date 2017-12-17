(function () {
  'use strict';

  angular
    .module('towers.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.towers', {
        abstract: true,
        url: '/towers',
        template: '<ui-view/>'
      })
      .state('admin.towers.list', {
        url: '',
        templateUrl: '/modules/towers/client/views/admin/list-towers.client.view.html',
        controller: 'TowersAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        }
      })
      .state('admin.towers.create', {
        url: '/create',
        templateUrl: '/modules/towers/client/views/admin/form-tower.client.view.html',
        controller: 'TowersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin']
        },
        resolve: {
          towerResolve: newTower
        }
      })
      .state('admin.towers.edit', {
        url: '/:towerId/edit',
        templateUrl: '/modules/towers/client/views/admin/form-tower.client.view.html',
        controller: 'TowersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin', 'c-admin'],
          pageTitle: '{{ towerResolve.title }}'
        },
        resolve: {
          towerResolve: getTower
        }
      });
  }

  getTower.$inject = ['$stateParams', 'TowersService'];

  function getTower($stateParams, TowersService) {
    return TowersService.get({
      towerId: $stateParams.towerId
    }).$promise;
  }

  newTower.$inject = ['TowersService'];

  function newTower(TowersService) {
    return new TowersService();
  }
}());
