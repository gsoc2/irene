import Ember from 'ember';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';
import ENUMS from 'irene/enums';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  ajax: Ember.inject.service(),
  notify: Ember.inject.service('notification-messages-service'),

  tagName: ["tr"],
  roles: ENUMS.ORGANIZATION_ROLES.CHOICES.slice(0, -1),
  member: null,
  organization: null,

  tUserRoleUpdated: t('userRoleUpdated'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Change member role */
  selectMemberRole: task(function * () {
    const role = parseInt(this.$('#org-user-role').val());

    const member = this.get('member');
    member.set('role', role);
    yield member.save();

  }).evented(),

  selectMemberRoleSucceeded: on('selectMemberRole:succeeded', function() {
    this.get('notify').success(this.get('tUserRoleUpdated'));
  }),

  selectMemberRoleErrored: on('selectMemberRole:errored', function(_, err) {
    let errMsg = this.get('tPleaseTryAgain');
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.get("notify").error(errMsg);
  }),

});
