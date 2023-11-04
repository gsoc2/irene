import { module, test } from 'qunit';
import { setupTest } from 'irene/tests/helpers';

module('Unit | Adapter | drf', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:drf');
    assert.ok(adapter);
  });
});
