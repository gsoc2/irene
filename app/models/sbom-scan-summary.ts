import Model, { attr } from '@ember-data/model';

export default class SbomScanSummaryModel extends Model {
  @attr('number')
  declare componentCount: number;

  @attr('number')
  declare applicationCount: number;

  @attr('number')
  declare libraryCount: number;

  @attr('number')
  declare frameworkCount: number;

  @attr('number')
  declare containerCount: number;

  @attr('number')
  declare deviceCount: number;

  @attr('number')
  declare fileCount: number;

  @attr('number')
  declare firmwareCount: number;

  @attr('number')
  declare operatingSystemCount: number;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'sbom-scan-summary': SbomScanSummaryModel;
  }
}
