import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import ENUMS from 'irene/enums';
import { analysisStatus } from 'irene/helpers/analysis-status';
import { riskText } from 'irene/helpers/risk-text';
import { module, test } from 'qunit';

module('Integration | Component | analysis-overview', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.store = this.owner.lookup('service:store');

    this.vulnerability = this.store.createRecord('vulnerability', {
      id: 1,
      types: [ENUMS.VULNERABILITY_TYPE.MANUAL],
    });

    this.analysis = this.store.createRecord('analysis', {
      id: 1,
      vulnerability: this.vulnerability,
    });
  });

  test('it renders with the right properties', async function (assert) {
    this.vulnerability.name = 'One Time Password';

    this.analysis.vulnerability = this.vulnerability;
    this.analysis.risk = ENUMS.RISK.CRITICAL;
    this.analysis.status = ENUMS.ANALYSIS_STATUS.COMPLETED;

    await render(hbs`<AnalysisOverview  @analysis={{this.analysis }}/>`);
    assert
      .dom('[data-test-analysis-id]')
      .exists()
      .hasTextContaining(this.analysis.id);
    assert
      .dom('[data-test-analysis-vulnerability-name]')
      .exists()
      .hasTextContaining(this.vulnerability.name);

    assert
      .dom('[data-test-analysis-risk]')
      .exists()
      .hasTextContaining(`${riskText([this.analysis.risk])}`);
    assert
      .dom('[data-test-analysis-status]')
      .exists()
      .hasTextContaining(`${analysisStatus([this.analysis.status])}`);
  });
});