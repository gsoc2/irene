import commondrf from './commondrf';

interface ScanParameterQuery {
  groupId: string | number;
}

export default class ScanParameterAdapter extends commondrf {
  _buildURL(_: string, id: string | number) {
    const baseurl = `${this.namespace_v2}/scan_parameters`;

    if (id) {
      return this.buildURLFromBase(`${baseurl}/${encodeURIComponent(id)}`);
    }

    return this.buildURLFromBase(baseurl);
  }

  _buildNestedURL(_: string | number, groupId: string | number) {
    const baseURL = `${this.namespace_v2}/scan_parameter_groups/${groupId}/scan_parameters`;

    return this.buildURLFromBase(baseURL);
  }

  urlForQuery<K extends string | number>(
    query: ScanParameterQuery,
    modelName: K
  ) {
    if (query.groupId) {
      const groupId = query.groupId;

      return this._buildNestedURL(modelName, groupId);
    }

    return super.urlForQuery(query, modelName);
  }
}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'scan-parameter': ScanParameterAdapter;
  }
}
