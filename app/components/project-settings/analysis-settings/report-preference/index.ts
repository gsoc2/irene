import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Store from '@ember-data/store';
import ProjectModel from 'irene/models/project';
import ProfileModel from 'irene/models/profile';

interface ProjectSettingsAnalysisSettingsReportPreferenceSignature {
  Args: {
    project: ProjectModel | null;
  };
}

export default class ProjectSettingsAnalysisSettingsReportPreferenceComponent extends Component<ProjectSettingsAnalysisSettingsReportPreferenceSignature> {
  @service declare store: Store;

  @tracked profile: ProfileModel | null = null;

  get project() {
    return this.args.project;
  }

  get reportPreference() {
    return this.profile?.reportPreference;
  }

  @action getProfie() {
    this.getProfileTask.perform();
  }

  @action saveDynamic(event: Event) {
    const target = event.target as HTMLInputElement;
    this.saveDynamicReportPreference.perform(target.checked);
  }

  @action saveManual(event: Event) {
    const target = event.target as HTMLInputElement;
    this.saveManualReportPreference.perform(target.checked);
  }

  @action saveAPI(event: Event) {
    const target = event.target as HTMLInputElement;
    this.saveAPIReportPreference.perform(target.checked);
  }

  saveDynamicReportPreference = task(async (dynamicScanChecked: boolean) => {
    const dynamicScan = dynamicScanChecked;
    const apiScan = !!this.reportPreference?.show_api_scan;
    const manualScan = !!this.reportPreference?.show_manual_scan;

    await this.saveReportPreference.perform(dynamicScan, apiScan, manualScan);
  });

  saveAPIReportPreference = task(async (apiScanChecked: boolean) => {
    const dynamicScan = !!this.reportPreference?.show_dynamic_scan;
    const apiScan = apiScanChecked;
    const manualScan = !!this.reportPreference?.show_manual_scan;

    await this.saveReportPreference.perform(dynamicScan, apiScan, manualScan);
  });

  saveManualReportPreference = task(async (manualScanChecked: boolean) => {
    const dynamicScan = !!this.reportPreference?.show_dynamic_scan;
    const apiScan = !!this.reportPreference?.show_api_scan;
    const manualScan = manualScanChecked;

    await this.saveReportPreference.perform(dynamicScan, apiScan, manualScan);
  });

  saveReportPreference = task(
    async (dynamicScan: boolean, apiScan: boolean, manualScan: boolean) => {
      const profile = this.store.peekRecord(
        'profile',
        Number(this.profile?.id)
      );

      await profile?.saveReportPreference({
        show_dynamic_scan: dynamicScan,
        show_api_scan: apiScan,
        show_manual_scan: manualScan,
      });
    }
  );

  getProfileTask = task(async () => {
    const profileId = this.project?.activeProfileId;
    const profile = await this.store.findRecord('profile', Number(profileId));
    this.profile = profile;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ProjectSettings::AnalysisSettings::ReportPreference': typeof ProjectSettingsAnalysisSettingsReportPreferenceComponent;
  }
}
