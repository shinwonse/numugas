import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';

type BoxProps<C extends ElementType> = {
  as?: C;
};

type Props<C extends ElementType> = PropsWithChildren<BoxProps<C>> &
  ComponentPropsWithoutRef<C>;

function Box<C extends ElementType = 'span'>({ as, children }: Props<C>) {
  const Component = as || 'span';
  return <Component>{children}</Component>;
}

export default Box;
