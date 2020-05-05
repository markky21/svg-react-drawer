import React, { useEffect, useRef } from 'react';

interface SvgLineProps {
  elementRef?: (el: Element) => any;
  x1: number;
  x2: number;
  y1: number;
  y2:number;
  stroke: string;
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
