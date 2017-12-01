(function () {
  'use strict';

  angular
    .module('services')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Services',
      state: 'services',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'services', {
      title: 'List Services',
      state: 'services.list',
      roles: ['']
    });
  }
}());
