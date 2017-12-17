(function () {
  'use strict';

  angular
    .module('bill_sale_details')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Bill_sale_details',
      state: 'bill_sale_details',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'bill_sale_details', {
      title: 'Listar detalles',
      state: 'bill_sale_details.list',
      roles: ['']
    });
  }
}());
