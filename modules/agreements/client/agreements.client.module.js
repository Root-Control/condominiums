(function (app) {
  'use strict';

  app.registerModule('agreements', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('agreements.admin', ['core.admin']);
  app.registerModule('agreements.admin.routes', ['core.admin.routes']);
  app.registerModule('agreements.services');
  app.registerModule('agreements.routes', ['ui.router', 'core.routes', 'agreements.services']);
}(ApplicationConfiguration));
