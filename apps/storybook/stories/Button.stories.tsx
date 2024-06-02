import { Button, ButtonColors } from '@numugas/ui/components';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

const meta = {
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    color: 'primary',
  },
};

export const Filled: StoryFn = (args) => {
  return (
    <ul style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
      {Object.keys(ButtonColors).map((color) => (
        <li key={color}>
          <Button {...args} color={color}>
            {color}
          </Button>
        </li>
      ))}
    </ul>
  );
};
