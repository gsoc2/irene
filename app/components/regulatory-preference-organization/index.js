import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import parseError from 'irene/utils/parse-error';

export default class RegulatoryPreferenceOrganizationComponent extends Component {
  @service intl;
  @service store;
  @service('notifications') notify;
  @service organization;

  @tracked orgPreference;

  constructor() {
    super(...arguments);
    this.fetchOrganizationPreference.perform();
  }

  get regulatoryPreferences() {
    return [
      {
        label: 'PCI-DSS',
        checked: Boolean(this.orgPreference?.reportPreference.show_pcidss),
        task: this.savePcidss,
        title: this.intl.t('pcidssExpansion'),
      },
      {
        label: 'HIPAA',
        checked: Boolean(this.orgPreference?.reportPreference.show_hipaa),
        task: this.saveHipaa,
        title: this.intl.t('hipaaExpansion'),
      },
      {
        label: 'GDPR',
        checked: Boolean(this.orgPreference?.reportPreference.show_gdpr),
        task: this.saveGdpr,
        title: this.intl.t('gdprExpansion'),
      },
    ];
  }

  @task
  *fetchOrganizationPreference() {
    try {
      this.orgPreference = yield this.store.queryRecord(
        'organization-preference',
        {}
      );
    } catch (err) {
      this.orgPreference = null;
      return;
    }
  }

  @task
  *savePcidss(event) {
    yield this.saveReportPreference.perform('show_pcidss', event);
  }

  @task
  *saveHipaa(event) {
    yield this.saveReportPreference.perform('show_hipaa', event);
  }

  @task
  *saveGdpr(event) {
    yield this.saveReportPreference.perform('show_gdpr', event);
  }

  @task
  *saveReportPreference(regulator, event) {
    try {
      this.orgPreference.reportPreference[regulator] = event.target.checked;
      yield this.orgPreference.save();
    } catch (err) {
      this.notify.error(parseError(err));
      event.target.checked = !event.target.checked;
    }
  }
}
