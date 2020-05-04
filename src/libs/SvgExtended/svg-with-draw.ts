import * as SVG from 'svg.js';
import {cicrle} from './src/circle';
import {ellipse} from './src/ellipse';
import {lineable} from './src/lineable';
import {rectangle} from './src/rectable';
import {svgDraw} from './src/svg.draw';
// import '@svgdotjs/svg.panzoom.js'

svgDraw(SVG);

cicrle(SVG);
ellipse(SVG);
lineable(SVG);
rectangle(SVG);

// panzoom(SVG);

export const SVGExtended = SVG;
