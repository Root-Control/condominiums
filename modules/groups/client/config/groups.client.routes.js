(function () {
  'use strict';

  angular
    .module('groups.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('groups', {
        abstract: true,
        url: '/groups',
        template: '<ui-view/>'
      })
      .state('groups.list', {
        url: '',
        templateUrl: '/modules/groups/client/views/list-groups.client.view.html',
        controller: 'GroupsListController',
        controllerAs: 'vm'
      })
      .state('groups.view', {
        url: '/:groupId',
        templateUrl: '/modules/groups/client/views/view-group.client.view.html',
        controller: 'GroupsController',
        controllerAs: 'vm',
        resolve: {
          groupResolve: getGroup
        },
        data: {
          pageTitle: '{{ groupResolve.name }}'
        }
      });
  }

  getGroup.$inject = ['$stateParams', 'GroupsService'];

  function getGroup($stateParams, GroupsService) {
    return GroupsService.get({
      groupId: $stateParams.groupId
    }).$promise;
  }
}());
