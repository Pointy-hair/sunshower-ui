declare module 'mxgraph' {

    export type DropTarget = (x:number, y:number) => Layer;

    export class mxDragSource {

        constructor(h:HTMLElement, u:ImportFunction);


        dragOffset              : mxPoint;
        guidesEnabled           : boolean;

        gridEnabled             : boolean;

        autoscroll              : boolean;

        highlightDropTargets    : boolean;


        getGraphForEvent        : (mxEvent) => Canvas;


        createDragElement       : () => Node;

        createPreviewElement    : (Canvas) => Node;

        mouseMove(e:mxEvent)    : void;

        setGuidesEnabled(enabled:boolean) : void;

        dragEnter(c:Canvas, e:mxEvent);

        /**
         *
         * @param c
         * @param x
         * @param y
         * @param e
         */
        getDropTarget(c : Canvas, x:number, y:number, e:mxEvent);

        /**
         *
         * @param graph
         * @param e
         * @param t
         * @param x
         * @param y
         */
        drop(
            graph:Canvas,
            e: mxEvent,
            t: Layer,
            x: number,
            y:number
        ) : Layer;
    }
}