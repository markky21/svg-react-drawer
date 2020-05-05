import * as SVG from 'svg.js';
import { SVGExtended } from '../libs/SvgExtended/svg-with-draw';

import { SvgToolbarService } from './svg-toolbar.service';
import { SvgDrawService } from './svg-draw.service';
import { SvgEventsService } from './svg-events.service';

const initialSVG =
  '<g id="SvgjsG1007"><circle id="SvgjsCircle1008" r="67.00109279644387" cx="355.00579019011303" cy="217.00353935564658" stroke="#ff0099" stroke-width="2" fill-opacity="0"></circle><circle id="SvgjsCircle1009" r="61.00099493407576" cx="486.0079268518167" cy="217.00353935564658" stroke="#ff0099" stroke-width="2" fill-opacity="0"></circle><ellipse id="SvgjsEllipse1010" rx="20.000326207893693" ry="93.00151686670567" cx="419.00683405537285" cy="317.00517039511504" stroke="#ff0099" stroke-width="2" fill-opacity="0"></ellipse><circle id="SvgjsCircle1011" r="228.0037187699881" cx="416.0067851241888" cy="305.00497467037883" stroke="#ff0099" stroke-width="2" fill-opacity="0"></circle><line id="SvgjsLine1012" x1="300.0048828125" y1="401.00653076171875" x2="413.00673619300477" y2="473.00771481668585" stroke="#ff0099" stroke-width="2" fill-opacity="0"></line></g>';

export class SvgMainService {
  private static instance: SvgMainService | null;

  public svgDraw: SVG.Doc;
  public svgGroup: SVG.G;

  private svgToolbarService: SvgToolbarService;
  private svgEventsService: SvgEventsService;
  private svgDrawService: SvgDrawService;

  public clear(): void {
    this.svgEventsService.clear();
    SvgMainService.instance = null;
  }

  static getInstance(): SvgMainService {
    if (!SvgMainService.instance) {
      SvgMainService.instance = new SvgMainService();
    }
    return SvgMainService.instance;
  }

  public initSVGScript(svg: Element): void {
    this.svgDraw = (SVGExtended as any)(svg);
    this.svgGroup = this.svgDraw.group();

    this.svgGroup.svg(initialSVG);
    this.getInstances();
  }

  private getInstances(): void {
    this.svgToolbarService = SvgToolbarService.getInstance();
    this.svgEventsService = SvgEventsService.getInstance(this.svgDraw);
    this.svgDrawService = SvgDrawService.getInstance(this.svgGroup, this.svgEventsService, this.svgToolbarService);
  }
}
