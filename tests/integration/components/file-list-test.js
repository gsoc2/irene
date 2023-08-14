import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, findAll, render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import Service from '@ember/service';

class RouterStub extends Service {
  currentRouteName = 'authenticated.project.files';
  selectedFiles = '';

  transitionTo(routeName, selectedFiles) {
    this.currentRouteName = routeName;
    this.selectedFiles = selectedFiles;
  }
}

module('Integration | Component | file-list', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    // Server mocks
    this.server.get('/profiles/:id/unknown_analysis_status', (_, req) => {
      return {
        id: req.params.id,
        status: true,
      };
    });

    this.server.get('/projects/:id/files', (schema) => {
      const files = schema.files.all().models;

      return {
        count: files.length,
        next: null,
        previous: null,
        results: files,
      };
    });

    this.server.get('/v2/projects/:id', (schema, req) => {
      return schema.projects.find(req.params.id).toJSON();
    });

    // Store service
    const store = this.owner.lookup('service:store');

    const project = this.server.create('project');
    const normalizedProject = store.normalize('project', project.toJSON());
    const projectRecord = store.push(normalizedProject);

    const vulnerabilities = this.server.createList('vulnerability', 3);

    const analyses = vulnerabilities.map((v, id) =>
      this.server.create('analysis', { id, vulnerability: v.id }).toJSON()
    );

    // File Models
    const files = this.server.createList('file', 3);
    const fileRecords = files.map((file) => {
      const normalizedFile = store.normalize('file', {
        ...file.toJSON(),
        analyses,
      });

      const fileModel = store.push(normalizedFile);
      fileModel.set('project', projectRecord);

      return fileModel;
    });

    // Common test props
    this.setProperties({
      project: projectRecord,
      fileRecords,
    });
  });

  test('it renders project overview header', async function (assert) {
    const breadcrumbItems = [
      't:allProjects:()',
      this.project.get('packageName'),
      't:allUploads:()',
    ];

    await render(hbs`<FileList @project={{this.project}} />`);

    assert.dom('[data-test-fileList-projectOverview-container]').exists();

    breadcrumbItems.map((item) => {
      assert.dom(`[data-test-fileList-breadcrumbItem="${item}"]`).exists();
    });

    assert
      .dom('[data-test-fileList-projectOverview-header]')
      .exists()
      .containsText('t:allUploads:()');

    assert
      .dom('[data-test-fileList-projectOverview-headerFileCompare]')
      .doesNotExist();

    assert
      .dom('[data-test-fileList-projectOverview-header-noSelectedFileText]')
      .exists()
      .hasText('t:fileList.selectFilesHeaderText:()');

    assert
      .dom('[data-test-fileList-projectOverview-header-compareBtn]')
      .doesNotExist();
  });

  test('it renders loading state and files', async function (assert) {
    this.server.get(
      '/projects/:id/files',
      (schema) => {
        const files = schema.files.all().models;

        return {
          count: files.length,
          next: null,
          previous: null,
          results: files,
        };
      },
      { timing: 150 }
    );

    render(hbs`<FileList @project={{this.project}} />`);

    await waitFor('[data-test-fileList-loadingContainer]', { timeout: 150 });

    assert.dom('[data-test-fileList-container]').exists();

    assert
      .dom('[data-test-fileList-loadingContainer]')
      .exists()
      .hasText('t:loading:()...');

    await waitFor('[data-test-fileList-fileOverview-item]', { timeout: 150 });

    const fileOverviewItems = findAll('[data-test-fileList-fileOverview-item]');

    assert.strictEqual(fileOverviewItems.length, this.fileRecords.length);

    // Sanity check first file overview
    const fileOverview1 = fileOverviewItems[0];

    assert
      .dom(fileOverview1)
      .exists()
      .containsText(this.fileRecords[0].name)
      .containsText(`${this.fileRecords[0].project.get('packageName')}`)
      .containsText(this.fileRecords[0].id)
      .containsText(this.fileRecords[0].version)
      .containsText(this.fileRecords[0].versionCode)
      .containsText(this.fileRecords[0].versionCode);

    assert
      .dom('[data-test-fileCompare-fileOverview-selectCheckBox]', fileOverview1)
      .exists();

    assert
      .dom(
        '[data-test-fileCompare-fileOverview-openInNewTabLink]',
        fileOverview1
      )
      .exists();
  });

  test('it selects and unselects two files to compare', async function (assert) {
    await render(hbs`<FileList @project={{this.project}} />`);

    assert.dom('[data-test-fileList-container]').exists();

    const [baseFile, compareFile] = this.fileRecords;

    const baseFileSelector = `[data-test-fileList-fileOverview='${baseFile.id}']`;
    const compareFileSelector = `[data-test-fileList-fileOverview='${compareFile.id}']`;

    // Selects only base file
    await click(
      `${baseFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom('[data-test-fileList-projectOverview-header-noSelectedFileText]')
      .doesNotExist();

    assert
      .dom('[data-test-fileList-projectOverview-headerFileCompare]')
      .exists();

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-summaryText1]'
      )
      .exists()
      .hasText('t:fileCompare.summary1:()');

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-summaryText2]'
      )
      .exists()
      .hasText('t:fileCompare.summary2:()');

    assert
      .dom('[data-test-fileList-projectOverview-header-compareBtn]')
      .exists()
      .hasText('t:compare:()');

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-baseFileChip]'
      )
      .exists()
      .hasText(baseFile.id);

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-baseFileSelectText]'
      )
      .doesNotExist();

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-compareFileChip]'
      )
      .doesNotExist();

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-compareFileSelectText]'
      )
      .exists()
      .hasText('t:fileCompare.selectCompareFile:()');

    // Selects compare  file
    await click(
      `${compareFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-compareFileSelectText]'
      )
      .doesNotExist();

    // Unselects base file
    await click(
      `${baseFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-baseFileChip]'
      )
      .doesNotExist();

    assert
      .dom(
        '[data-test-fileList-projectOverview-headerFileCompare-baseFileSelectText]'
      )
      .exists()
      .hasText('t:fileCompare.selectBaseFile:()');

    // Unselects compare file
    await click(
      `${compareFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom('[data-test-fileList-projectOverview-header-noSelectedFileText]')
      .exists();

    assert
      .dom('[data-test-fileList-projectOverview-header-compareBtn]')
      .doesNotExist();

    assert
      .dom('[data-test-fileList-projectOverview-headerFileCompare]')
      .doesNotExist();
  });

  test('it compares two selected files', async function (assert) {
    this.owner.register('service:router', RouterStub);

    await render(hbs`<FileList @project={{this.project}} />`);

    const [baseFile, compareFile] = this.fileRecords;

    const baseFileSelector = `[data-test-fileList-fileOverview='${baseFile.id}']`;
    const compareFileSelector = `[data-test-fileList-fileOverview='${compareFile.id}']`;

    // Selects base and compare files
    await click(
      `${baseFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    await click(
      `${compareFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom('[data-test-fileList-projectOverview-header-compareBtn]')
      .exists()
      .hasText('t:compare:()');

    await click('[data-test-fileList-projectOverview-header-compareBtn]');

    const router = this.owner.lookup('service:router');

    assert.strictEqual(
      router.currentRouteName,
      'authenticated.dashboard.compare'
    );

    assert.strictEqual(
      router.selectedFiles,
      `${baseFile?.id}...${compareFile?.id}`
    );
  });

  test('it should disable other files in list if two files have already been selected', async function (assert) {
    const [baseFile, compareFile, otherFile] = this.fileRecords;

    const baseFileSelector = `[data-test-fileList-fileOverview='${baseFile.id}']`;
    const compareFileSelector = `[data-test-fileList-fileOverview='${compareFile.id}']`;

    const otherFileSelector = `[data-test-fileList-fileOverview='${otherFile.id}']`;

    await render(hbs`<FileList @project={{this.project}} />`);

    // Selects base and compare files
    await click(
      `${baseFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    await click(
      `${compareFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
    );

    assert
      .dom(
        `${otherFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
      )
      .exists()
      .hasAttribute('disabled');

    // Deselects base file
    await click(
      '[data-test-fileList-projectOverview-headerFileCompare-baseFileChip] [data-test-chip-delete-btn]'
    );

    assert
      .dom(
        `${otherFileSelector} [data-test-fileCompare-fileOverview-selectCheckBox]`
      )
      .exists()
      .doesNotHaveAttribute('disabled');
  });
});
