import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Strake',
    brandUrl: 'https://github.com/codysue/strake',
    brandTarget: '_blank',
  }),
});
