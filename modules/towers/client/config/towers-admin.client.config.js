(function () {
  'use strict';

  // Configuring the Towers Admin module
  angular
    .module('towers.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar torres',
      state: 'admin.towers.list'
    });
  }
}());
