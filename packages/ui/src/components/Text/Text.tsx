import { ElementType, forwardRef, ReactElement } from 'react';

import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from '../../core/types';

type TextProps<C extends ElementType> = PolymorphicComponentPropWithRef<
  C,
  { color?: 'black' }
>;

type TextComponent = <C extends ElementType = 'span'>(
  props: TextProps<C>
) => ReactElement | null;

const Text = forwardRef(
  <C extends ElementType = 'span'>(
    { as, children, color }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'span';

    const style = color ? { style: { color } } : {};

    return (
      <Component {...style} ref={ref}>
        {children}
      </Component>
    );
  }
);

export default Text;
