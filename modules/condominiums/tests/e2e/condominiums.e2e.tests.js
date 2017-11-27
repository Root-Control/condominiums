'use strict';

describe('Condominiums E2E Tests:', function () {
  describe('Test condominiums page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/condominiums');
      expect(element.all(by.repeater('condominium in condominiums')).count()).toEqual(0);
    });
  });
});
