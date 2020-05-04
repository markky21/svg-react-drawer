import React, { useEffect, useRef } from 'react';

interface SvgLineProps extends Partial<SVGLineElement> {
  elementRef?: (el: Element) => any;
}

export const SvgLine: React.FC<SvgLineProps> = React.memo(props => {
  const { elementRef, ...elementProps } = props;
  const element = useRef(null);

  const current = element?.current;
  useEffect(() => {
    if (!elementRef) return;
    elementRef(current);
  }, [current, elementRef]);

  return <line {...(elementProps as any)} />;
});
