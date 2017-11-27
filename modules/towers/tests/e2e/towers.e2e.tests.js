'use strict';

describe('Towers E2E Tests:', function () {
  describe('Test towers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/towers');
      expect(element.all(by.repeater('tower in towers')).count()).toEqual(0);
    });
  });
});
