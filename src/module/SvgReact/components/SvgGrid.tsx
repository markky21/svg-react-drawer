import React, { useEffect, useRef } from 'react';

interface SvgGridProps {
  elementRef?: (el: Element) => any;
}

export const SvgGrid: React.FC<SvgGridProps> = React.memo(props => {
  const { elementRef } = props;
  const element = useRef(null);

  const current = element?.current;
  useEffect(() => {
    if (!elementRef) return;
    elementRef(current);
  }, [current, elementRef]);

  return (
    <>
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </>
  );
});
