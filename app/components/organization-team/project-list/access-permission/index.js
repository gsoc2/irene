import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class OrganizationTeamProjectListAccessPermission extends Component {
  @service intl;
  @service('notifications') notify;

  tPleaseTryAgain = this.intl.t('pleaseTryAgain');
  tPermissionChanged = this.intl.t('permissionChanged');

  @task *changeProjectWrite() {
    try {
      const prj = this.args.project;
      yield prj.updateProject(this.args.team.id);

      this.notify.success(this.tPermissionChanged);
    } catch (err) {
      let errMsg = this.tPleaseTryAgain;

      if (err.errors && err.errors.length) {
        errMsg = err.errors[0].detail || errMsg;
      } else if (err.message) {
        errMsg = err.message;
      }

      this.notify.error(errMsg);
    }
  }
}