import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | app-monitoring/table/row', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.lastFile = this.server.create('file');
    this.latestAmAppVersion = this.server.create('am-app-version');
    this.lastSync = this.server.create('am-app-sync');
    this.project = this.server.create('project', {
      lastFile: this.lastFile,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
    });

    this.onRowClick = function () {
      return;
    };
  });

  test('It renders with the right row data', async function (assert) {
    await render(
      hbs`<AppMonitoring::Table::Row @amApp={{this.amApp}} @onRowClick={{this.onRowClick}} />`
    );

    assert.strictEqual(
      this.element.querySelectorAll('[data-test-am-table-row-item]').length,
      5,
      'It has five row items'
    );

    assert
      .dom(`[data-test-am-table-row-app-namespace]`)
      .containsText(this.amApp.project.packageName);

    assert
      .dom(`[data-test-am-table-row-app-name]`)
      .containsText(this.amApp.project.lastFile.name);

    assert
      .dom(`[data-test-am-table-row-store-version]`)
      .hasText(`${this.amApp.latestAmAppVersion.comparableVersion}`);

    assert
      .dom(
        `[data-test-am-table-row-platform=${this.amApp.project.platformIconClass}]`
      )
      .exists();

    assert
      .dom(`[data-test-am-table-row-version]`)
      .hasText(`${this.amApp.project.lastFile.comparableVersion}`);
  });

  test('It renders "INACTIVE" in status column if settings is disabled or monitoringEnabled is false', async function (assert) {
    this.set('settings', {
      id: 1,
      enabled: false,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      monitoringEnabled: true,
    });

    await render(
      hbs`<AppMonitoring::Table::Row @amApp={{this.amApp}}  @settings={{@settings}} @onRowClick={{this.onRowClick}} />`
    );

    assert.strictEqual(
      this.element.querySelectorAll('[data-test-am-table-row-item]').length,
      5,
      'It has five row items'
    );

    assert.dom(`[data-test-am-table-row-status] `).containsText(`inactive`);

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: null,
      lastSync: null,
      monitoringEnabled: false,
    });

    this.set('settings', {
      id: 1,
      enabled: true,
    });

    await render(
      hbs`<AppMonitoring::Table::Row @amApp={{this.amApp}} @settings={{@settings}}  @onRowClick={{this.onRowClick}} />`
    );
    assert.dom(`[data-test-am-table-row-status]`).containsText(`inactive`);
  });

  test('It renders "ACTIVE" in status column if settings is enabled and monitoringEnabled is enabled', async function (assert) {
    this.set('settings', {
      id: 1,
      enabled: true,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      monitoringEnabled: true,
    });

    await render(
      hbs`<AppMonitoring::Table::Row @amApp={{this.amApp}}  @settings={{@settings}} @onRowClick={{this.onRowClick}} />`
    );

    assert.dom(`[data-test-am-table-row-status] `).containsText(`active`);
  });

  test('it renders "NOT FOUND" status in store version column if comparableVersion is empty and latestAmAppVersion is null', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      comparableVersion: '',
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: null,
      lastSync: this.lastSync,
      monitoringEnabled: true,
    });

    this.set('settings', {
      id: 1,
      enabled: true,
    });

    await render(
      hbs`<AppMonitoring::Table::Row @amApp={{this.amApp}}  @settings={{@settings}} @onRowClick={{this.onRowClick}} />`
    );
    assert
      .dom(`[data-test-am-table-row-store-version]`)
      .containsText(`not found`);
  });

  test('it renders "PENDING" status in store version column if comparableVersion is empty and lastSync are null', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      comparableVersion: '',
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      lastSync: null,
      monitoringEnabled: true,
    });

    this.set('settings', {
      id: 1,
      enabled: true,
    });

    await render(
      hbs`
      <AppMonitoring::Table::Row 
        @amApp={{this.amApp}}  
        @settings={{@settings}} 
        @onRowClick={{this.onRowClick}} 
      />`
    );
    assert
      .dom(
        `[data-test-am-table-row-store-version] [data-test-am-status-element]`
      )
      .containsText(`pending`);
  });
});
