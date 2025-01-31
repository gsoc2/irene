/* eslint-disable ember/no-mixins */
import DRFAdapter from 'ember-django-adapter/adapters/drf';
import ENV from 'irene/config/environment';
import IreneAdapterMixin from 'irene/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';

export default class CommonDRFAdapter extends DRFAdapter.extend(
  IreneAdapterMixin
) {
  host = ENV.host;
  namespace = ENV.namespace;
  namespace_v2 = ENV.namespace_v2;
  addTrailingSlashes = false;

  @service organization;

  buildURLFromBase(resource_url) {
    const hostURLstr = this.host;
    try {
      const hostURL = new URL(hostURLstr);

      return new URL(resource_url, hostURL).href;
    } catch (e) {
      if (hostURLstr === '/' || hostURLstr === '') {
        if (resource_url[0] !== '/') {
          return '/' + resource_url;
        }

        return resource_url;
      }

      throw e;
    }
  }
}
