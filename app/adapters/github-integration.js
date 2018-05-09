import DRFAdapter from './drf';
import ENV from 'irene/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DRFAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  namespace: ENV.namespace,
  addTrailingSlashes: false,
  authorizer: 'authorizer:irene',
  query: function query(store, type, query) {
    let url = `${this.get('host')}/${this.get('namespace')}/profiles/${query.id}/github_integration`;
    return this.ajax(url, 'GET');
  }
});
