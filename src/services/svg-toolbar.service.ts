import { BehaviorSubject, Observable } from 'rxjs';
import { DrawElement } from '../module/SvgReact/SvgReact.model';
import { map } from 'rxjs/operators';

export interface DrawElementObject {
  drawElement: DrawElement;
  stroke: string;
  'stroke-width': number;
  'fill-opacity': number;
}

export class SvgToolbarService {
  private static instance: SvgToolbarService | null;

  public readonly selectedDrawElement$ = new BehaviorSubject<DrawElement>(DrawElement.LINE);

  public hostDestroyed(): void {
    SvgToolbarService.instance = null;
  }

  static getInstance(): SvgToolbarService {
    if (!SvgToolbarService.instance) {
      SvgToolbarService.instance = new SvgToolbarService();
    }

    return SvgToolbarService.instance;
  }

  public get drawElementObject$(): Observable<DrawElementObject> {
    return this.selectedDrawElement$.pipe(
      map(drawElement => ({
        drawElement,
        stroke: '#ff0099',
        'stroke-width': 2,
        'fill-opacity': 0,
      })),
    );
  }
}
