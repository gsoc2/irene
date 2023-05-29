import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import IntlService from 'ember-intl/services/intl';
import dayjs from 'dayjs';

import SbomScanSummaryModel from 'irene/models/sbom-scan-summary';
import SbomScanModel, { SbomScanStatus } from 'irene/models/sbom-scan';

export interface SbomScanDetailsFileScanSummarySignature {
  Args: {
    sbomScan: SbomScanModel;
    sbomScanSummary: SbomScanSummaryModel | null;
  };
}

export default class SbomScanDetailsFileScanSummaryComponent extends Component<SbomScanDetailsFileScanSummarySignature> {
  @service declare intl: IntlService;

  get scanStatusCompleted() {
    return this.args.sbomScan.status === SbomScanStatus.COMPLETED;
  }

  get fileSummary() {
    return [
      {
        label: this.intl.t('version'),
        value: this.args.sbomScan.file.get('version'),
      },
      {
        label: this.intl.t('sbomModule.versionCode'),
        value: this.args.sbomScan.file.get('versionCode'),
      },
      {
        label: this.intl.t('file'),
        value: this.args.sbomScan.file.get('id'),
        link: true,
        linkArgs: {
          route: 'authenticated.file',
          model: this.args.sbomScan.file.get('id'),
        },
        hideDivider: this.args.sbomScan.status !== SbomScanStatus.COMPLETED,
      },
    ];
  }

  get scanSummary() {
    return [
      {
        label: this.intl.t('sbomModule.totalComponents'),
        value: [`${this.args.sbomScanSummary?.componentCount ?? ''}`],
      },
      {
        label: this.intl.t('sbomModule.componentType'),
        value: this.componentTypeCounts,
      },
      {
        label: this.intl.t('status'),
        component: 'sbom/scan-status' as const,
      },
      {
        label: this.intl.t('sbomModule.generatedDate'),
        value: [dayjs(this.args.sbomScan.completedAt).format('MMM DD, YYYY')],
        isLast: true,
      },
    ];
  }

  get componentTypeCounts() {
    type SbomScanSummaryCountKey = keyof typeof this.scanSummaryKeyLabelMap;

    return Object.entries(this.scanSummaryKeyLabelMap)
      .map(([key, label]) => {
        const count = this.args.sbomScanSummary?.get(
          key as SbomScanSummaryCountKey
        );

        return count ? `${label} - ${count}` : null;
      })
      .filter(Boolean);
  }

  get scanSummaryKeyLabelMap() {
    return {
      applicationCount: this.intl.t('application'),
      containerCount: this.intl.t('container'),
      deviceCount: this.intl.t('device'),
      fileCount: this.intl.t('file'),
      firmwareCount: this.intl.t('firmware'),
      frameworkCount: this.intl.t('framework'),
      libraryCount: this.intl.t('library'),
      operatingSystemCount: this.intl.t('operatingSystem'),
    };
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Sbom::ScanDetails::FileScanSummary': typeof SbomScanDetailsFileScanSummaryComponent;
  }
}
