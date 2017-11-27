(function () {
  'use strict';

  // Configuring the Departments Admin module
  angular
    .module('departments.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar departamentos',
      state: 'admin.departments.list'
    });
  }
}());
