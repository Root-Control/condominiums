(function () {
  'use strict';

  angular
    .module('group_services.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.group_services', {
        abstract: true,
        url: '/group_services',
        template: '<ui-view/>'
      })
      .state('admin.group_services.list', {
        url: '',
        templateUrl: '/modules/group_services/client/views/admin/list-group_services.client.view.html',
        controller: 'Group_ServicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.group_services.create', {
        url: '/create',
        templateUrl: '/modules/group_services/client/views/admin/form-group_service.client.view.html',
        controller: 'Group_ServicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          group_serviceResolve: newGroup_Service
        }
      })
      .state('admin.group_services.edit', {
        url: '/:group_serviceId/edit',
        templateUrl: '/modules/group_services/client/views/admin/form-group_service.client.view.html',
        controller: 'Group_ServicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ group_serviceResolve.title }}'
        },
        resolve: {
          group_serviceResolve: getGroup_Service
        }
      });
  }

  getGroup_Service.$inject = ['$stateParams', 'Group_ServicesService'];

  function getGroup_Service($stateParams, Group_ServicesService) {
    return Group_ServicesService.get({
      group_serviceId: $stateParams.group_serviceId
    }).$promise;
  }

  newGroup_Service.$inject = ['Group_ServicesService'];

  function newGroup_Service(Group_ServicesService) {
    return new Group_ServicesService();
  }
}());
