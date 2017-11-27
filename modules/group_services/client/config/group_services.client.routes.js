(function () {
  'use strict';

  angular
    .module('group_services.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('group_services', {
        abstract: true,
        url: '/group_services',
        template: '<ui-view/>'
      })
      .state('group_services.list', {
        url: '',
        templateUrl: '/modules/group_services/client/views/list-group_services.client.view.html',
        controller: 'Group_ServicesListController',
        controllerAs: 'vm'
      })
      .state('group_services.view', {
        url: '/:group_serviceId',
        templateUrl: '/modules/group_services/client/views/view-group_service.client.view.html',
        controller: 'Group_ServicesController',
        controllerAs: 'vm',
        resolve: {
          group_serviceResolve: getGroup_Service
        },
        data: {
          pageTitle: '{{ group_serviceResolve.title }}'
        }
      });
  }

  getGroup_Service.$inject = ['$stateParams', 'Group_ServicesService'];

  function getGroup_Service($stateParams, Group_ServicesService) {
    return Group_ServicesService.get({
      group_serviceId: $stateParams.group_serviceId
    }).$promise;
  }
}());
