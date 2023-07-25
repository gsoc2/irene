import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;
  @service router;
  @service store;
  @service('browser/window') window;

  async beforeModel(transition) {
    if (this.session.isAuthenticated) {
      const { queryParams } = transition.to;

      if (queryParams?.next) {
        const userId = this.session.data.authenticated.user_id;
        const user = await this.store.findRecord('user', userId);
        const username = user.username;

        const nextURL = `${queryParams.next}&username=${username}`;
        this.window.location.assign(nextURL);
      } else {
        this.router.transitionTo('authenticated.projects');
      }
    }
  }
}
