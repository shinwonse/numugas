import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

export default {
  component: Button,
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const 기본: Story = {
  args: {
    children: '버튼',
  },
};
