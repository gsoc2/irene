import {
  PowerSelectArgs,
  Select,
} from 'ember-power-select/components/power-select';
import styles from './index.scss';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';
import { TypographyColors, TypographyVariant } from '../ak-typography';

type AkSelectLabelTypographyVariant = TypographyVariant;
type AkSelectLabelTypographyColor = TypographyColors;

interface AkSelectNamedArgs<O> extends PowerSelectArgs {
  labelId?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  triggerClass?: string;
  placeholder?: string;
  renderInPlace?: boolean;
  error?: string;
  loadingMessage?: string;
  selectedItemComponent?: string;
  labelTypographyVariant?: AkSelectLabelTypographyVariant;
  labelTypographyColor?: AkSelectLabelTypographyColor;
  verticalPosition?: 'above' | 'below' | 'auto';
  options: O[];
}

export interface AkSelectSignature<O> {
  Element: HTMLDivElement;
  Args: AkSelectNamedArgs<O>;
  Blocks: {
    default: [option: O, select?: Select];
  };
}

export default class AkSelectComponent<O> extends Component<
  AkSelectSignature<O>
> {
  get labelId() {
    return this.args.labelId || `ak-select-${guidFor(this)}`;
  }

  get classes() {
    return {
      dropdown: styles['ak-select-dropdown'],
      trigger: styles['ak-select-trigger'],
      triggerError: styles['ak-select-trigger-error'],
    };
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AkSelect: typeof AkSelectComponent;
  }
}
