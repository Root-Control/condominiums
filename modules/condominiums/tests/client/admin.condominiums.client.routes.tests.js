(function () {
  'use strict';

  describe('Condominiums Route Tests', function () {
    // Initialize global variables
    var $scope,
      CondominiumsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CondominiumsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CondominiumsService = _CondominiumsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.condominiums');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/condominiums');
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
          liststate = $state.get('admin.condominiums.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/condominiums/client/views/admin/list-condominiums.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CondominiumsAdminController,
          mockCondominium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.condominiums.create');
          $templateCache.put('/modules/condominiums/client/views/admin/form-condominium.client.view.html', '');

          // Create mock condominium
          mockCondominium = new CondominiumsService();

          // Initialize Controller
          CondominiumsAdminController = $controller('CondominiumsAdminController as vm', {
            $scope: $scope,
            condominiumResolve: mockCondominium
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.condominiumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/condominiums/create');
        }));

        it('should attach an condominium to the controller scope', function () {
          expect($scope.vm.condominium._id).toBe(mockCondominium._id);
          expect($scope.vm.condominium._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/condominiums/client/views/admin/form-condominium.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CondominiumsAdminController,
          mockCondominium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.condominiums.edit');
          $templateCache.put('/modules/condominiums/client/views/admin/form-condominium.client.view.html', '');

          // Create mock condominium
          mockCondominium = new CondominiumsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'An Condominium about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CondominiumsAdminController = $controller('CondominiumsAdminController as vm', {
            $scope: $scope,
            condominiumResolve: mockCondominium
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:condominiumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.condominiumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            condominiumId: 1
          })).toEqual('/admin/condominiums/1/edit');
        }));

        it('should attach an condominium to the controller scope', function () {
          expect($scope.vm.condominium._id).toBe(mockCondominium._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/condominiums/client/views/admin/form-condominium.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
