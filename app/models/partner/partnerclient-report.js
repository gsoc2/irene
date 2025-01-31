import Model, { attr } from '@ember-data/model';

export default class PartnerclientReportModel extends Model {
  @attr('string') language;
  @attr('number') progress;
  @attr('date') generatedOn;
  @attr('number') file;

  get isGenerating() {
    return this.progress < 100;
  }
}
