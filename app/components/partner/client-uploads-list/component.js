import Component from '@glimmer/component';
import { PaginationMixin } from '../../../mixins/paginate';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PartnerClientUploadsListComponent extends PaginationMixin(
  Component
) {
  @service store;

  @tracked targetModel = 'partner/partnerclient-file';

  get uploads() {
    return this.objects;
  }

  get extraQueryStrings() {
    return JSON.stringify({
      clientId: this.args.clientId,
      projectId: this.args.projectId,
    });
  }
}
