/* eslint-disable ember/no-mixins */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { PaginationMixin } from '../../../mixins/paginate';

export default class PartnerClientListComponent extends PaginationMixin(
  Component
) {
  @service partner;

  targetModel = 'partner/partnerclient';
  sortProperties = 'createdOn:desc';
}
