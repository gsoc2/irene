import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';

module(
  'Integration | Component | app-monitoring/table/last-scanned',
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function () {
      this.file = this.server.create('file');

      this.project = this.server.create('project', {
        lastFile: this.file,
      });

      this.amApp = this.server.create('am-app', 1, {
        project: this.project,
      });
    });

    test('it renders the correct row version', async function (assert) {
      await render(
        hbs`<AppMonitoring::Table::LastScanned @amApp={{this.amApp}} />`
      );

      assert
        .dom(`[data-test-am-table-row-version]`)
        .hasText(`${this.amApp.project.lastFile.comparableVersion}`);
    });
  }
);
