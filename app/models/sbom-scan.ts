import Model, { AsyncBelongsTo, belongsTo, attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

import FileModel from './file';
import SbomAppModel from './sbom-app';

export enum SbomScanStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  FAILED = 4,
}

export default class SbomScanModel extends Model {
  @service declare intl: IntlService;

  @belongsTo('file')
  declare file: AsyncBelongsTo<FileModel>;

  @belongsTo('sbom-app')
  declare sbProject: AsyncBelongsTo<SbomAppModel>;

  @attr('number')
  declare status: SbomScanStatus;

  @attr('date')
  declare createdAt: Date;

  @attr('date')
  declare completedAt: Date;

  get statusValue() {
    switch (this.status) {
      case SbomScanStatus.PENDING:
        return this.intl.t('chipStatus.pending');

      case SbomScanStatus.IN_PROGRESS:
        return this.intl.t('chipStatus.inProgress');

      case SbomScanStatus.COMPLETED:
        return this.intl.t('chipStatus.completed');

      case SbomScanStatus.FAILED:
        return this.intl.t('chipStatus.failed');

      default:
        return this.intl.t('chipStatus.pending');
    }
  }

  get statusColor() {
    switch (this.status) {
      case SbomScanStatus.PENDING:
        return 'warn';

      case SbomScanStatus.IN_PROGRESS:
        return 'warn';

      case SbomScanStatus.COMPLETED:
        return 'success';

      case SbomScanStatus.FAILED:
        return 'error';

      default:
        return 'warn';
    }
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'sbom-scan': SbomScanModel;
  }
}
