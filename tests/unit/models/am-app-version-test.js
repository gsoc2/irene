import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | am app version', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('am-app-version', {});
    assert.ok(model);
  });
});
