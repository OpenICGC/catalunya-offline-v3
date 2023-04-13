import React from 'react';
import {Meta, Story} from '@storybook/react';

import SearchBoxAndMenu, {SearchBoxAndMenuProps} from './SearchBoxAndMenu';

export default {
  title: 'Common/SearchBoxAndMenu',
  component: SearchBoxAndMenu,
  //decorators: [(Story) => <div style={{padding: 21}}><Story/></div>]
} as Meta;

const Template: Story<SearchBoxAndMenuProps> = args => <SearchBoxAndMenu {...args}/>;

export const Default = Template.bind({});
Default.args = {
};