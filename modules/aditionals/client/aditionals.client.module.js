(function (app) {
  'use strict';

  app.registerModule('aditionals', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('aditionals.admin', ['core.admin']);
  app.registerModule('aditionals.admin.routes', ['core.admin.routes']);
  app.registerModule('aditionals.services');
  app.registerModule('aditionals.routes', ['ui.router', 'core.routes', 'aditionals.services']);
}(ApplicationConfiguration));
