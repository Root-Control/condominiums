(function () {
  'use strict';

  angular
    .module('global_services')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Global_services',
      state: 'global_services',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'global_services', {
      title: 'List Global_services',
      state: 'global_services.list',
      roles: ['']
    });
  }
}());
