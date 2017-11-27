(function (app) {
  'use strict';

  app.registerModule('towers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('towers.admin', ['core.admin']);
  app.registerModule('towers.admin.routes', ['core.admin.routes']);
  app.registerModule('towers.services');
  app.registerModule('towers.routes', ['ui.router', 'core.routes', 'towers.services']);
}(ApplicationConfiguration));
