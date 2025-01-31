import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  id(i) {
    return 100 + i;
  },

  inviter(i) {
    return i + 1;
  },

  invitee: null,
  organization: 1,
  team: faker.datatype.number(),
  email: faker.internet.email(),
  is_accepted: false,
  created_on: faker.date.past(),
  updated_on: faker.date.past(),
});
