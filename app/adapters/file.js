import DRFAdapter from './drf';
import ENV from 'irene/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DRFAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  namespace: ENV.namespace,
  namespace_v2: ENV.namespace_v2,
  addTrailingSlashes: false,
  authorizer: 'authorizer:irene',
  _buildURL: function (modelName, id) {
    if(id) {
      const baseurl = `${this.get('host')}/${this.get('namespace_v2')}/files`;
      return `${baseurl}/${encodeURIComponent(id)}`;
    }
  },
  _buildNestedURL(modelName, projectId) {
    const projectURL = `${this.get('host')}/${this.get('namespace')}/projects/${projectId}`;
    const fileURL = [projectURL, 'files'].join('/');
    return fileURL;
  },
  urlForQuery(query, modelName) {
    return this._buildNestedURL(modelName, query.projectId);
  },
  async createDynamicScan(store, type, snapshot, isApiScanEnabled) {
    const dynamicUrl = `${this.get('host')}/${this.get('namespace_v2')}/files/${snapshot.id}/dynamicscans?isApiScanEnabled=${isApiScanEnabled}`;
    let createDynamicScan = await this.ajax(dynamicUrl,'POST');
    return this.store.findRecord("dynamicscan",createDynamicScan.id)
  },
  async currentDynamicScan(store, type, snapshot) {
    const dynamicUrl = `${this.get('host')}/${this.get('namespace_v2')}/files/${snapshot.id}/active_dynamicscan`;
    let currentDynamicScan = await this.ajax(dynamicUrl,'GET');
    return this.store.findRecord("dynamicscan",currentDynamicScan.id)
  },
});
