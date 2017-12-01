(function (app) {
  'use strict';

  app.registerModule('bill_sale_details', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('bill_sale_details.admin', ['core.admin']);
  app.registerModule('bill_sale_details.admin.routes', ['core.admin.routes']);
  app.registerModule('bill_sale_details.services');
  app.registerModule('bill_sale_details.routes', ['ui.router', 'core.routes', 'bill_sale_details.services']);
}(ApplicationConfiguration));
