/* eslint-disable ember/no-mixins, prettier/prettier */
import Route from '@ember/routing/route';
import { ScrollTopMixin } from '../../../mixins/scroll-top';

export default class AuthenticatedSettingsGeneralRoute extends ScrollTopMixin(Route) {
  model () {
    return this.modelFor('authenticated.settings');
  }
}
