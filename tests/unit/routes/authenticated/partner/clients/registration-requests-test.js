import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | authenticated/partner/clients/registration-requests', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:authenticated/partner/clients/registration-requests');
    assert.ok(route);
  });
});
