import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

export interface SbomAppScanQueryParam {
  scan_limit: string;
  scan_offset: string;
  scan_query: string;
}

export interface SbomAppScanParam extends SbomAppScanQueryParam {
  sbom_project_id: string;
}

export default class AuthenticatedDashboardSbomAppScansRoute extends Route {
  @service declare store: Store;

  queryParams = {
    scan_limit: {
      refreshModel: true,
    },
    scan_offset: {
      refreshModel: true,
    },
    scan_query: {
      refreshModel: true,
    },
  };

  async model(params: SbomAppScanParam) {
    const {
      sbom_project_id,
      scan_limit = '10',
      scan_offset = '0',
      scan_query = '',
    } = params;

    return {
      sbomProject: await this.store.findRecord('sbom-project', sbom_project_id),
      queryParams: { scan_limit, scan_offset, scan_query },
    };
  }
}
