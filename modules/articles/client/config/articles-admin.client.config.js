(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('articles.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  //  Hiro
/*  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar artículos',
      state: 'admin.articles.list'
    });
  }*/
}());
