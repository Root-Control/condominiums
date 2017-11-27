(function () {
  'use strict';

  angular
    .module('groups.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.groups', {
        abstract: true,
        url: '/groups',
        template: '<ui-view/>'
      })
      .state('admin.groups.list', {
        url: '',
        templateUrl: '/modules/groups/client/views/admin/list-groups.client.view.html',
        controller: 'GroupsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin']
        }
      })
      .state('admin.groups.create', {
        url: '/create',
        templateUrl: '/modules/groups/client/views/admin/form-group.client.view.html',
        controller: 'GroupsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin']
        },
        resolve: {
          groupResolve: newGroup
        }
      })
      .state('admin.groups.edit', {
        url: '/:groupId/edit',
        templateUrl: '/modules/groups/client/views/admin/form-group.client.view.html',
        controller: 'GroupsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['superadmin'],
          pageTitle: '{{ groupResolve.title }}'
        },
        resolve: {
          groupResolve: getGroup
        }
      });
  }

  getGroup.$inject = ['$stateParams', 'GroupsService'];

  function getGroup($stateParams, GroupsService) {
    return GroupsService.get({
      groupId: $stateParams.groupId
    }).$promise;
  }

  newGroup.$inject = ['GroupsService'];

  function newGroup(GroupsService) {
    return new GroupsService();
  }
}());
