﻿(function () {
  'use strict';

  describe('Clients Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClientsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClientsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClientsService = _ClientsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.clients');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/clients');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.clients.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/clients/client/views/admin/list-clients.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClientsAdminController,
          mockClient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.clients.create');
          $templateCache.put('/modules/clients/client/views/admin/form-client.client.view.html', '');

          // Create mock client
          mockClient = new ClientsService();

          // Initialize Controller
          ClientsAdminController = $controller('ClientsAdminController as vm', {
            $scope: $scope,
            clientResolve: mockClient
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.clientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/clients/create');
        }));

        it('should attach an client to the controller scope', function () {
          expect($scope.vm.client._id).toBe(mockClient._id);
          expect($scope.vm.client._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/clients/client/views/admin/form-client.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClientsAdminController,
          mockClient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.clients.edit');
          $templateCache.put('/modules/clients/client/views/admin/form-client.client.view.html', '');

          // Create mock client
          mockClient = new ClientsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Client about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ClientsAdminController = $controller('ClientsAdminController as vm', {
            $scope: $scope,
            clientResolve: mockClient
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:clientId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.clientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            clientId: 1
          })).toEqual('/admin/clients/1/edit');
        }));

        it('should attach an client to the controller scope', function () {
          expect($scope.vm.client._id).toBe(mockClient._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/clients/client/views/admin/form-client.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
