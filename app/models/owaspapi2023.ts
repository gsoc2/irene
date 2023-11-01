import Model, { attr } from '@ember-data/model';

export default class OwaspApi2023Model extends Model {
  @attr('string')
  declare code: string;

  @attr('string')
  declare title: string;

  @attr('string')
  declare year: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    owaspapi2023: OwaspApi2023Model;
  }
}
