
import {
    Canvas,
    Layer,
    mxDragSource,
    mxEvent,
    mxGraph
} from "mxgraph";
import {
    ElementFactory
} from "lib/designer/canvas/palette";
import {
    CanvasUtilities
} from "lib/designer/canvas/utils/canvas-utilities";



export class DragSource extends mxDragSource {

    constructor(
        private canvas: Canvas,
        e:HTMLElement,
        private factory : ElementFactory
    ) {
        super(e, factory.importFunction);
        this.highlightDropTargets = true;
    }


    dragEnter(c: Canvas, e: mxEvent) {
        let m = super.dragEnter(c, e);
        return m;
    }

    mouseMove(e:mxEvent): void {
        super.mouseMove(e);
    }

    drop(graph:mxGraph, e: mxEvent, t: Layer, x: number, y:number) : Layer {
        return super.drop(graph, e, t, x, y);
    }

    getDropTarget(c:mxGraph, x:number, y: number, e:mxEvent) : Layer {
        let p = c.getDefaultParent(),
            d = Number.MAX_SAFE_INTEGER,
            [, val] = this.findDropTarget(p, x, y, d);
        return val;
    }

    //if this gets slow we can implement KD or BS partitioning.
    private findDropTarget(p: Layer, x:number, y: number, m:number): [number, Layer] {
        let min = null,
            rn = m;
        if(p && p.children && p.children.length) {
            for(let c of p.children) {
                let drawable = CanvasUtilities.asDrawable(c);
                if(this.factory.isHostableBy(drawable)) {
                    let geo = drawable.geometry,
                        gx = geo.x,
                        gy = geo.y,
                        dx = Math.sqrt(Math.pow(x - gx, 2) + Math.pow(y - gy, 2));
                    if(dx < rn) {
                        rn = dx;
                        min = drawable;
                    }
                }
                let [cd, cval] = this.findDropTarget(c, x, y, Number.MAX_SAFE_INTEGER);
                if(cd < rn) {
                    rn = cd;
                    min = cval;
                }
            }
        }
        return [rn, min];
    }
}