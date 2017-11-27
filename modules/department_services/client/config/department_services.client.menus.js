(function () {
  'use strict';

  angular
    .module('department_services')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Department_services',
      state: 'department_services',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'department_services', {
      title: 'List Department_services',
      state: 'department_services.list',
      roles: ['']
    });
  }
}());
