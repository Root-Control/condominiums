(function () {
  'use strict';

  // Configuring the Group_Services Admin module
  angular
    .module('group_services.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Group_Services',
      state: 'admin.group_services.list'
    });
  }
}());
