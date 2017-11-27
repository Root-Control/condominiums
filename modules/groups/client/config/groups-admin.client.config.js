(function () {
  'use strict';

  // Configuring the Groups Admin module
  angular
    .module('groups.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar grupos',
      state: 'admin.groups.list'
    });
  }
}());
