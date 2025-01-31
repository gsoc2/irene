import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import ENV from 'irene/config/environment';
import Store from '@ember-data/store';
import AmAppModel from '../models/am-app';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import { DS } from 'ember-data';

type AmAppModelArray = DS.AdapterPopulatedRecordArray<AmAppModel> & {
  meta: { count: number };
};

export default class AppMonitoringService extends Service {
  @service declare store: Store;
  @service('notifications') declare notify: NotificationService;

  @tracked appMonitoringData?: DS.AdapterPopulatedRecordArray<AmAppModel>;
  @tracked limit = 10;
  @tracked offset = 0;
  @tracked appMonitoringDataCount = 0;

  get isFetchingAMData() {
    return this.fetch.isRunning;
  }

  setLimitOffset({ limit = 10, offset = 0 }) {
    this.limit = limit;
    this.offset = offset;
    return this;
  }

  async reload() {
    await this.fetch.perform();
  }

  fetch = task(async () => {
    try {
      const monitoringData = (await this.store.query('am-app', {
        limit: this.limit,
        offset: this.offset,
      })) as AmAppModelArray;

      this.appMonitoringData = monitoringData;
      this.appMonitoringDataCount = monitoringData.meta.count;
    } catch {
      this.notify.error(
        'Failed to load App Monitoring Data. Check your network and try again.',
        ENV.notifications
      );
    }
  });
}
