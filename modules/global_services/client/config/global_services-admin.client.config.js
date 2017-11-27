(function () {
  'use strict';

  // Configuring the Global_services Admin module
  angular
    .module('global_services.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Global_services',
      state: 'admin.global_services.list'
    });
  }
}());
