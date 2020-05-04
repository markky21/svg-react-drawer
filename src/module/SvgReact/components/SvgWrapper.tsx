import React, { useEffect, useRef } from 'react';

import { SvgGrid } from './SvgGrid';
import { SvgMainService } from '../../../services/svg-main.service';

interface SvgWrapperProps {
  width?: number | string;
  height?: number;
}

export const SvgWrapper: React.FC<SvgWrapperProps> = React.memo(({ width, height, children }) => {
  const svgMain = useRef(null);
  const wrapper = useRef(null);

  const svgMainElement = svgMain.current;

  useEffect(
    () => {
      if (!svgMainElement) return;
      SvgMainService.getInstance().initSVGScript(svgMainElement);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!!svgMainElement]
  );

  return (
    <React.Fragment>
      <div id="main" ref={wrapper} style={{ width: '100%', height: '100%' }}>
        <svg
          ref={svgMain}
          className="aperture"
          width={width}
          height={height}
          preserveAspectRatio="none"
          viewBox={`0 0 ${+width} ${height}`}
        >
          <svg id="editor" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <SvgGrid />
            {children}
          </svg>
        </svg>
      </div>
    </React.Fragment>
  );
});
