import { computed } from '@ember/object';
import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'AkAutocomplete',
  component: 'ak-autocomplete',
  excludeStories: [],
};

const actions = {
  handleInputChange(event) {
    this.set('searchQuery', event.target.value);
  },
  handleMenuItemClick(item, closeMenu) {
    this.set('searchQuery', item.label);
    closeMenu();
  },
};

const menuItems = [
  { label: 'username' },
  { label: 'password' },
  { label: 'email' },
  { label: 'phone' },
  { label: 'phone2' },
  { label: 'username2' },
  { label: 'username1', isLast: true },
];

const AutocompleteTemplate = (args) => ({
  template: hbs`
    <AkAutocomplete
      @handleClear={{action (mut this.searchQuery) ''}}
      @searchQuery={{this.searchQuery}}
      {{on 'input' (action this.handleInputChange)}}
      as |ac|
    >
      {{#each this.filteredMenuItems as |mi|}}
        <ac.listItem
          @divider={{not mi.isLast}}
          {{on 'click' (action this.handleMenuItemClick mi ac.closeMenu)}}
        >
          <AkTypography>{{mi.label}}</AkTypography>
        </ac.listItem>
      {{/each}}
    </AkAutocomplete>
  `,
  context: {
    ...args,
    ...actions,
    menuItems,
    filteredMenuItems: computed('searchQuery', 'menuItems', function () {
      const query = this.searchQuery.toLowerCase();
      return this.menuItems.filter((item) =>
        item.label.toLowerCase().includes(query)
      );
    }),
  },
});

export const Basic = AutocompleteTemplate.bind({});

Basic.args = {
  searchQuery: '',
};
