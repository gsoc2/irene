import faker from 'faker';
import ENUMS from 'irene/enums';
import Base from './base';

export default Base.extend({
  id(i) {
    return i + 1;
  },

  version: faker.random.number(),
  github_repo: faker.company.companyName(),
  jira_project: faker.company.companyName(),
  test_user: faker.name.firstName(),
  platform_version: faker.random.number(),
  file_count: 2,
  show_unknown_analysis: faker.random.boolean(),
  show_ignored_analysis: faker.random.boolean(),
  is_manual_scan_available: faker.random.boolean(),

  name() {
    return faker.company.companyName();
  },

  active_profile_id(i) {
    return i + 1;
  },

  platform() {
    return faker.random.arrayElement([0, 1]);
  },

  test_password() {
    return faker.internet.password();
  },

  url() {
    return faker.internet.domainName();
  },

  package_name() {
    return faker.internet.domainName();
  },

  device_type() {
    return faker.random.arrayElement(ENUMS.DEVICE_TYPE.VALUES);
  },

  platformIconClass() {
    switch (this.platform) {
      case ENUMS.PLATFORM.ANDROID:
        return 'android';
      case ENUMS.PLATFORM.IOS:
        return 'apple';
      case ENUMS.PLATFORM.WINDOWS:
        return 'windows';
      default:
        return 'mobile';
    }
  },

  api_url_filters() {
    var desc = [];
    for (var i = 0; i < 5; i++) {
      desc.push(faker.internet.domainName(2).split(' ').join(' -> '));
    }
    return desc.join(',');
  },
});
