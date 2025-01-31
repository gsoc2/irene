/* eslint-disable ember/no-computed-properties-in-native-classes */
import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';

export default class PartnerclientModel extends Model {
  @attr('date') lastUploadedOn;
  @attr('string') logo;
  @attr('string') name;
  @reads('name') company;
  @attr() ownerEmails;
  @attr('date') createdOn;

  @computed('name')
  get isEmptyTitle() {
    return isEmpty(this.name);
  }
}
