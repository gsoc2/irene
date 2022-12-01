import Component from '@glimmer/component';

export default class AkLinkComponent extends Component {
  get modelOrModels() {
    let hasModel = 'model' in this.args;
    let hasModels = 'models' in this.args;

    if (hasModel) {
      return [this.args.model];
    } else if (hasModels) {
      return this.args.models;
    }

    return [];
  }
}
