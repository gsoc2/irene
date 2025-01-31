import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Store from '@ember-data/store';
import IntlService from 'ember-intl/services/intl';
import { task } from 'ember-concurrency';

import ENV from 'irene/config/environment';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default class UploadAppComponent extends Component {
  @service declare store: Store;
  @service declare intl: IntlService;
  @service declare rollbar: any;
  @service('notifications') declare notify: NotificationService;

  tErrorWhileFetching: string;
  tErrorWhileUploading: string;
  tFileUploadedSuccessfully: string;

  constructor(owner: unknown, args: object) {
    super(owner, args);

    this.tErrorWhileFetching = this.intl.t('errorWhileFetching');
    this.tErrorWhileUploading = this.intl.t('errorWhileUploading');
    this.tFileUploadedSuccessfully = this.intl.t('fileUploadedSuccessfully');
  }

  handleUploadApp = task(async (queue, file) => {
    try {
      const uploadItem = await this.store.queryRecord('uploadApp', {});

      await file.uploadBinary(uploadItem.url, {
        method: 'PUT',
        withCredentials: false,
      });

      await uploadItem.save();

      triggerAnalytics(
        'feature',
        ENV.csb['applicationUpload'] as CsbAnalyticsFeatureData
      );

      this.notify.success(this.tFileUploadedSuccessfully);
    } catch (e) {
      const err = this.tErrorWhileUploading;

      this.notify.error(err);

      this.rollbar.critical(err, e);

      queue.remove(file); // since queue won't flush for failed uploads
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UploadApp: typeof UploadAppComponent;
  }
}
