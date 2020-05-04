import * as SVG from 'svg.js';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SvgEventsService } from './svg-events.service';
import { SvgToolbarService } from './svg-toolbar.service';

interface SVGDrawElement extends SVG.Element {
  draw: (event, options?, value?) => SVGDrawElement;
}

export class SvgDrawService {
  private readonly destroyed$ = new Subject();
  private static instance: SvgDrawService | null;

  private currentDrawElement: SVGDrawElement;
  private readonly shapes$ = new BehaviorSubject<SVGDrawElement[]>([]);

  public constructor(
    private svgGroup: SVG.G,
    private svgEventsService: SvgEventsService,
    private svgToolbarService: SvgToolbarService
  ) {
    this.init();
  }

  static getInstance(
    svgGroup: SVG.G,
    svgEventsService: SvgEventsService,
    svgToolbarService: SvgToolbarService
  ): SvgDrawService {
    if (!SvgDrawService.instance) {
      SvgDrawService.instance = new SvgDrawService(svgGroup, svgEventsService, svgToolbarService);
    }
    return SvgDrawService.instance;
  }

  public init(): void {
    this.handleDrawToolChange();
  }

  public clear(): void {
    this.destroyed$.next();
    SvgDrawService.instance = null;
  }

  public handleDrawToolChange(): void {
    this.svgToolbarService.drawElementObject$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ drawElement, ...drawConfig }) => {
        if (this.currentDrawElement) this.drawingCancel();
        if (!drawElement) return;

        this.currentDrawElement = (this.svgGroup[drawElement] as any)().attr(drawConfig);
        this.onDrawDone();
        this.onDrawStop();
      });

    this.svgEventsService.mouseDown$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (!this.currentDrawElement) return;
      this.currentDrawElement.draw(event);
    });

    this.svgEventsService.mouseKeyPress$.pipe(takeUntil(this.destroyed$)).subscribe(e => {
      if (e.key === 'Enter') {
        this.drawingDone();
      }
    });
  }

  private drawingDone(): SVG.Element {
    return (this.currentDrawElement as any).draw('done');
  }
  private drawingCancel(): void {
    this.currentDrawElement.draw('cancel');
    this.currentDrawElement.off(undefined);
    this.currentDrawElement = null;
  }
  private drawingPoint(event: Event): SVG.Element {
    return (this.currentDrawElement as any).draw('point', event);
  }
  private drawingUpdate(event: Event): SVG.Element {
    return (this.currentDrawElement as any).draw('update', event);
  }
  private drawingStop(event: Event): SVG.Element {
    return (this.currentDrawElement as any).draw('stop', event);
  }

  private onDrawDone(): void {
    this.currentDrawElement.on('drawdone', () => {});
  }
  private onDrawStop(): void {
    this.currentDrawElement.on('drawstop', () => {
      this.svgToolbarService.selectedDrawElement$.next(this.svgToolbarService.selectedDrawElement$.value);
      this.shapes$.next([...this.shapes$.value, this.currentDrawElement]);
    });
  }
}
