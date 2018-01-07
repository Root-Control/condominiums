(function () {
  'use strict';

  // Configuring the Bill_sale_details Admin module
  angular
    .module('bill_sale_details.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
/*    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar detalles de boleta',
      state: 'admin.bill_sale_details.list'
    });*/
  }
}());
