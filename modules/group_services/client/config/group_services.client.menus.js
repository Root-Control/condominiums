(function () {
  'use strict';

  angular
    .module('group_services')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Group_Services',
      state: 'group_services',
      type: 'dropdown',
      roles: ['']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'group_services', {
      title: 'List Group_Services',
      state: 'group_services.list',
      roles: ['']
    });
  }
}());
