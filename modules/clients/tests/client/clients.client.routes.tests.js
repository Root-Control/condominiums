(function () {
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
          mainstate = $state.get('clients');
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
          liststate = $state.get('clients.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/clients/client/views/list-clients.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ClientsController,
          mockClient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('clients.view');
          $templateCache.put('/modules/clients/client/views/view-client.client.view.html', '');

          // create mock client
          mockClient = new ClientsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Client about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ClientsController = $controller('ClientsController as vm', {
            $scope: $scope,
            clientResolve: mockClient
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:clientId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.clientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            clientId: 1
          })).toEqual('/clients/1');
        }));

        it('should attach an client to the controller scope', function () {
          expect($scope.vm.client._id).toBe(mockClient._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/clients/client/views/view-client.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/clients/client/views/list-clients.client.view.html', '');

          $state.go('clients.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('clients/');
          $rootScope.$digest();

          expect($location.path()).toBe('/clients');
          expect($state.current.templateUrl).toBe('/modules/clients/client/views/list-clients.client.view.html');
        }));
      });
    });
  });
}());
