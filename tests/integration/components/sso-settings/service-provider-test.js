import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';

module(
  'Integration | Component | sso-settings/service-provider',
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders service provider title & desc', async function (assert) {
      await render(hbs`<SsoSettings::ServiceProvider />`);

      assert.dom(`[data-test-sp-title]`).hasText(`t:serviceProvider:() (SP)`);
      assert.dom(`[data-test-sp-desc]`).hasText(`t:spMetadataDesc:()`);
    });

    // TODO: need to updated after AkRadioBtn has been added
    // test('it should render 2 radio btns for config types', async function (assert) {
    //   await render(hbs`<SsoSettings::ServiceProvider />`);

    // });

    test('it should render SP manual setting config details', async function (assert) {
      const spConfig = {
        acs_url: 'https://sherlock.staging.do.appknox.io/api/sso/saml2/acs',
        entity_id: 'https://sherlock.staging.do.appknox.io/api/sso/saml2',
        metadata:
          '<?xml version="1.0"?>\n<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"\n                     validUntil="2021-10-29T06:10:49Z"\n                     cacheDuration="PT604800S"\n                     entityID="https://sherlock.staging.do.appknox.io/api/sso/saml2">\n    <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">\n        <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"\n                                Location="https://sherlock.staging.do.appknox.io/api/sso/saml2/sls" />\n        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>\n        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"\n                                     Location="https://sherlock.staging.do.appknox.io/api/sso/saml2/acs"\n                                     index="1" />\n    </md:SPSSODescriptor>\n    <md:Organization>\n        <md:OrganizationName xml:lang="en-US">Appknox</md:OrganizationName>\n        <md:OrganizationDisplayName xml:lang="en-US">Appknox</md:OrganizationDisplayName>\n        <md:OrganizationURL xml:lang="en-US">https://sherlock.staging.do.appknox.io</md:OrganizationURL>\n    </md:Organization>\n    <md:ContactPerson contactType="technical">\n        <md:GivenName>Engineering</md:GivenName>\n        <md:EmailAddress>engineering@appknox.com</md:EmailAddress>\n    </md:ContactPerson>\n    <md:ContactPerson contactType="support">\n        <md:GivenName>Appknox Support</md:GivenName>\n        <md:EmailAddress>support@appknox.com</md:EmailAddress>\n    </md:ContactPerson>\n</md:EntityDescriptor>',
        named_id_format:
          'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      };
      this.set('spConfig', spConfig);
      this.set('defaultConfig', 'manual');
      await render(
        hbs`<SsoSettings::ServiceProvider @spMetadata={{this.spConfig}} @defaultConfig={{this.defaultConfig}}/>`
      );

      assert
        .dom(`[data-test-sp-manual-entity-id-label]`)
        .hasText(`t:entityID:()`);
      assert
        .dom(`[data-test-sp-manual-entity-id-value]`)
        .hasText(this.spConfig.entity_id);
      assert.dom(`[data-test-sp-manual-acsurl-label]`).hasText(`t:acsURL:()`);
      assert
        .dom(`[data-test-sp-manual-acsurl-value]`)
        .hasText(this.spConfig.acs_url);

      assert
        .dom(`[data-test-sp-manual-name-id-format-label]`)
        .hasText(`t:nameIDFormat:()`);
      assert
        .dom(`[data-test-sp-manual-name-id-format-value]`)
        .hasText(this.spConfig.named_id_format);
    });

    test('it should render SP XML metadata', async function (assert) {
      const spConfig = {
        metadata: '<?xml version="1.0"?>metadata',
      };
      this.set('spConfig', spConfig);
      this.set('defaultConfig', 'xml');
      await render(
        hbs`<SsoSettings::ServiceProvider @spMetadata={{this.spConfig}} @defaultConfig={{this.defaultConfig}}/>`
      );

      assert
        .dom(`[data-test-sp-xml-metadata-textarea]`)
        .hasValue(this.spConfig.metadata);
    });

    // TODO toggle between config types need to be added
  }
);
