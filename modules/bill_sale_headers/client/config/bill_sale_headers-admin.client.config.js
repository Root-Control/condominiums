(function () {
  'use strict';

  // Configuring the Bill_sale_headers Admin module
  angular
    .module('bill_sale_headers.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
/*    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Bill_sale_headers',
      state: 'admin.bill_sale_headers.list'
    });*/
  }
}());
