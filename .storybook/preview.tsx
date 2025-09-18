import type { Preview } from '@storybook/react';
import { AntdProvider } from '../src/lib/AntdProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <AntdProvider>
        <Story />
      </AntdProvider>
    ),
  ],
};

export default preview;
