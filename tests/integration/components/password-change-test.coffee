`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'password-change', 'Integration | Component | password change', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 1

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{password-change}}"""

  assert.equal @$().text().trim(), 'Current PasswordNew PasswordConfirm PasswordChange Password'