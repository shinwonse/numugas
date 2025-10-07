import type React from 'react';

declare module 'react' {
  export const unstable_ViewTransition: React.ComponentType<{
    children: React.ReactNode;
  }>;
}
