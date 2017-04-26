import {
    Layer,
    mxCell,
    mxCellOverlay, mxGeometry
} from 'mxgraph';

import {Canvas} from "lib/designer/canvas";
import {UUID} from "lib/common/lang";



export class Overlay extends mxCellOverlay {

}

export interface Drawable extends Layer {
    getLabel() : string;
    overlays() : Overlay[];
    addTo(canvas: Canvas) : boolean;
}



export abstract class RenderableElement extends mxCell implements Drawable {

    constructor(
        label: string,
        x:number,
        y:number,
        width:number,
        height:number
    ) {
        super(label, new mxGeometry(x, y, width, height));
    }

    getLabel() : string {
        return UUID.random();
    }




    overlays() : Overlay[] {
        return [];
    }

    addTo(canvas:Canvas) : boolean {
        canvas.addAndRecord(this, null);
        return true;
    }
}


export abstract class RenderableVertex extends RenderableElement {

    constructor(
        label: string,
        x:number,
        y:number,
        width:number,
        height:number
    ) {
        super(label, x, y, width, height);
        this.setVertex(true);
    }
}
