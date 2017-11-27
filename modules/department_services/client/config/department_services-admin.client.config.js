(function () {
  'use strict';

  // Configuring the Department_services Admin module
  angular
    .module('department_services.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Department_services',
      state: 'admin.department_services.list'
    });
  }
}());
