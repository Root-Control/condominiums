(function () {
  'use strict';

  angular
    .module('bill_sale_details.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.bill_sale_details', {
        abstract: true,
        url: '/bill_sale_details',
        template: '<ui-view/>'
      })
      .state('admin.bill_sale_details.list', {
        url: '',
        templateUrl: '/modules/bill_sale_details/client/views/admin/list-bill_sale_details.client.view.html',
        controller: 'Bill_sale_detailsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        }
      })
      .state('admin.bill_sale_details.create', {
        url: '/create',
        templateUrl: '/modules/bill_sale_details/client/views/admin/form-bill_sale_detail.client.view.html',
        controller: 'Bill_sale_detailsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin']
        },
        resolve: {
          bill_sale_detailResolve: newBill_sale_detail
        }
      })
      .state('admin.bill_sale_details.edit', {
        url: '/:bill_sale_detailId/edit',
        templateUrl: '/modules/bill_sale_details/client/views/admin/form-bill_sale_detail.client.view.html',
        controller: 'Bill_sale_detailsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'superadmin'],
          pageTitle: '{{ bill_sale_detailResolve.title }}'
        },
        resolve: {
          bill_sale_detailResolve: getBill_sale_detail
        }
      });
  }

  getBill_sale_detail.$inject = ['$stateParams', 'Bill_sale_detailsService'];

  function getBill_sale_detail($stateParams, Bill_sale_detailsService) {
    return Bill_sale_detailsService.get({
      bill_sale_detailId: $stateParams.bill_sale_detailId
    }).$promise;
  }

  newBill_sale_detail.$inject = ['Bill_sale_detailsService'];

  function newBill_sale_detail(Bill_sale_detailsService) {
    return new Bill_sale_detailsService();
  }
}());
