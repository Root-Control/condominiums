(function () {
  'use strict';

  // Configuring the Supplies Admin module
  angular
    .module('supplies.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Suministros',
      state: 'admin.supplies.list'
    });
  }
}());
