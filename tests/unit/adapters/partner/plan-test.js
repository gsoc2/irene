import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | partner/plan', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:partner/plan');
    assert.ok(adapter);
  });
});
