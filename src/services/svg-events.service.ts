import * as SVG from 'svg.js';
import { fromEvent, Observable } from 'rxjs';

export class SvgEventsService {
  private static instance: SvgEventsService | null;

  public readonly mouseDown$: Observable<SVG.Doc>;
  public readonly mouseUp$: Observable<SVG.Doc>;
  public readonly mouseKeyPress$: Observable<KeyboardEvent>;

  public constructor(private svgDraw: SVG.Doc) {
    this.mouseDown$ = this._mouseDown$(svgDraw);
    this.mouseUp$ = this._mouseUp$(svgDraw);
    this.mouseKeyPress$ = this._mouseKeyPress$(svgDraw);
  }

  static getInstance(svgDraw: SVG.Doc): SvgEventsService {
    if (!SvgEventsService.instance) {
      SvgEventsService.instance = new SvgEventsService(svgDraw);
    }

    return SvgEventsService.instance;
  }

  public clear(): void {
    this.unbindAll();
    SvgEventsService.instance = null;
  }

  private _mouseDown$(svgDraw: SVG.Doc): Observable<SVG.Doc> {
    return new Observable(observer => {
      svgDraw.on('mousedown', event => observer.next(event));
    });
  }

  private _mouseKeyPress$(svgDraw: SVG.Doc): Observable<KeyboardEvent> {
    return fromEvent(document, 'keypress') as Observable<KeyboardEvent>;
  }

  private _mouseUp$(svgDraw: SVG.Doc): Observable<SVG.Doc> {
    return new Observable(observer => {
      svgDraw.on('mouseup', event => observer.next(event));
    });
  }

  public unbindAll(): SVG.Doc {
    return (this.svgDraw as any).off();
  }
}
