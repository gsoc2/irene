import commondrf from './commondrf';

interface ScanParameterGroupQuery {
  projectId: string | number;
}

export default class ScanParameterGroupAdapter extends commondrf {
  _buildURL(_: string, id: string | number) {
    const baseurl = `${this.namespace_v2}/scan_parameter_groups`;

    if (id) {
      return this.buildURLFromBase(`${baseurl}/${encodeURIComponent(id)}`);
    }

    return this.buildURLFromBase(baseurl);
  }

  _buildNestedURL(_: string | number, projectId: string | number) {
    const baseURL = `${this.namespace_v2}/project/${projectId}/scan_parameter_groups`;

    return this.buildURLFromBase(baseURL);
  }

  urlForQuery<K extends string | number>(
    query: ScanParameterGroupQuery,
    modelName: K
  ) {
    if (query.projectId) {
      const projectId = query.projectId;

      return this._buildNestedURL(modelName, projectId);
    }

    return super.urlForQuery(query, modelName);
  }
}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'scan-parameter-group': ScanParameterGroupAdapter;
  }
}
