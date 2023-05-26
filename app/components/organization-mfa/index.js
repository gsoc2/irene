import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

class OrganizationMfa extends Component {
  @service intl;
  @service('notifications') notify;

  @tracked isSavingStatus = false;
  @tracked showAddEditPopup = false;

  tChangedMandatoryMFA = this.intl.t('changedMandatoryMFA');
  tPleaseTryAgain = this.intl.t('pleaseTryAgain');

  get organization() {
    return this.args.organization;
  }

  get isMfaMandateDisabled() {
    return !this.args.user.mfaEnabled || this.isSavingStatus;
  }

  get isUserMfaDisabled() {
    return !this.args.user.mfaEnabled;
  }

  setMandatoryMFA = task(async (_, mandatoryStateChecked) => {
    try {
      this.isSavingStatus = true;

      const org = this.organization;
      org.set('mandatoryMfa', mandatoryStateChecked);

      await org.save();

      this.isSavingStatus = false;
      this.notify.success(this.tChangedMandatoryMFA);
    } catch (err) {
      this.isSavingStatus = false;
      let errMsg = this.tPleaseTryAgain;

      if (err.errors && err.errors.length) {
        errMsg = err.errors[0].detail || errMsg;
      } else if (err.message) {
        errMsg = err.message;
      }

      this.notify.error(errMsg);
    }
  });
}

export default OrganizationMfa;
