(function (app) {
  'use strict';

  app.registerModule('bill_sale_headers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('bill_sale_headers.admin', ['core.admin']);
  app.registerModule('bill_sale_headers.admin.routes', ['core.admin.routes']);
  app.registerModule('bill_sale_headers.services');
  app.registerModule('bill_sale_headers.routes', ['ui.router', 'core.routes', 'bill_sale_headers.services']);
}(ApplicationConfiguration));
