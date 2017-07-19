`import { moduleForModel, test } from 'ember-qunit'`

moduleForModel 'collaboration', 'Unit | Model | collaboration', {
  # Specify the other units that are required for this test.
  needs: ['model:project', 'model:user', 'model:team']
}

test 'it exists', (assert) ->
  model = @subject()
  # store = @store()
  assert.ok !!model
