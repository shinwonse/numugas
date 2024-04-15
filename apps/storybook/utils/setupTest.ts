import { cleanup, render, RenderOptions } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom';
import { ReactElement } from 'react';

afterEach(() => {
  cleanup();
});

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): any =>
  render(ui, {
    wrapper: ({ children })  => children,
    ...options,
  });


export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
