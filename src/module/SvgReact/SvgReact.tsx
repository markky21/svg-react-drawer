import React, { useEffect, useRef, useState } from 'react';
import { ResizeSensor } from 'css-element-queries';

import { SvgWrapper } from './components/SvgWrapper';
import { Toolbar } from './components/Toolbar';

export const SvgReact: React.FC = () => {
  const wrapper = useRef(null);

  const [wrapperRect, setWrapperRect] = useState<DOMRect>({
    bottom: 0,
    left: 0,
    right: 0,
    toJSON(): any {},
    top: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(
    () => {
      if (!wrapper.current) return;
      const subscription = new ResizeSensor(wrapper.current, () => {
        setWrapperRect(wrapper.current.getBoundingClientRect());
      });
      return () => subscription?.detach();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wrapper.current]
  );

  return (
    <>
      width: {wrapperRect.width}, height: {wrapperRect.height}
      <section style={{ width: '100%', height: '100%' }} ref={wrapper}>
        <SvgWrapper width={wrapperRect.width} height={wrapperRect.height}>
          <rect x={30} width={100} height={200} fill={'red'} />
        </SvgWrapper>
        <Toolbar />
      </section>
    </>
  );
};
