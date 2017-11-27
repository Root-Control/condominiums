(function (app) {
  'use strict';

  app.registerModule('condominiums', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('condominiums.admin', ['core.admin']);
  app.registerModule('condominiums.admin.routes', ['core.admin.routes']);
  app.registerModule('condominiums.services');
  app.registerModule('condominiums.routes', ['ui.router', 'core.routes', 'condominiums.services']);
}(ApplicationConfiguration));
