import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { WithBoundArgs } from '@glint/template';

import AkListItemComponent from '../ak-list/item';

export interface AkAutocompleteSignature {
  Args: {
    searchQuery: string;
    handleClear: (event: MouseEvent) => void;
    placeholder?: string;
  };
  Element: HTMLElement;
  Blocks: {
    default: [
      {
        listItem: WithBoundArgs<typeof AkListItemComponent, 'button' | 'role'>;
        closeMenu(): void;
      }
    ];
  };
}

export default class AkAutocompleteComponent extends Component<AkAutocompleteSignature> {
  @tracked anchorRef: HTMLElement | null = null;

  @action
  handleFocusChange(event: FocusEvent) {
    const target = event.currentTarget as HTMLElement;
    this.anchorRef = target.closest('[class*="_ak-text-field-root_"]');
  }

  @action
  handleMenuClose() {
    this.anchorRef = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AkAutocomplete: typeof AkAutocompleteComponent;
  }
}
