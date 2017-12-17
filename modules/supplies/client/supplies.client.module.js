(function (app) {
  'use strict';

  app.registerModule('supplies', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('supplies.admin', ['core.admin']);
  app.registerModule('supplies.admin.routes', ['core.admin.routes']);
  app.registerModule('supplies.services');
  app.registerModule('supplies.routes', ['ui.router', 'core.routes', 'supplies.services']);
}(ApplicationConfiguration));
