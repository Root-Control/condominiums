(function () {
  'use strict';

  // Configuring the Tower_services Admin module
  angular
    .module('tower_services.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tower_services',
      state: 'admin.tower_services.list'
    });
  }
}());
