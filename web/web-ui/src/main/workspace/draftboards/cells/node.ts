import {
    Layer,
    mxImage,
    mxCellOverlay,
    mxConstants,
    mxGeometry
} from 'mxgraph';
import {Registry} from 'utils/registry';

import {
    ApplicationElement,
    InfrastructureElement
} from 'elements/elements';


import {LayeredNode} from "./layer";
import {ApplicationDeployment} from "./deployment";
import {Builder} from "../graph/builder";

import {ElementEvent} from 'elements/events';

import {
    VertexMenu,
    NetworkMenuItem,
    StorageMenuItem
} from "../menu/task-cell";
import {Constrained} from "./cell";
import {EditorContext} from "../editor";


export class Node extends LayeredNode<InfrastructureElement> implements Constrained {


    rows                : number = 1;
    columns             : number = 1;
    scale               : number = 1;
    applications        : ApplicationDeployment[] = [];

    static count: number = 0;

    constructor(
        parent:Layer,
        element:InfrastructureElement,
        x:number,
        y:number,
        registry?: Registry
    ) {
        super(
            parent,
            element, x, y, registry);

        this.data.name = "Host " + Node.count++;
    }

    public addTo(builder:Builder) : Layer {
        this.createMenu(builder);
        return super.addTo(builder);
    }

    private createMenu(builder: Builder) {
        let menu = new VertexMenu(builder, this, '\uf013');
        menu.addItem(new NetworkMenuItem());
        menu.addItem(new StorageMenuItem());
    }


    addApplicationById(id: string): void {
        // this.registry.client.fetch(`docker/images/${id}`)
        //     .then(r => r.json() as any)
        //     .then(r => {
        //         this.addApplication(
        //             new ApplicationDeployment(
        //                 this.registry,
        //                 new ApplicationElement(
        //                     `${this.registry.get(Registry.S3_IMAGES_PATH)}/${r.logo_url.large}`,
        //                     r.name, id
        //                 ),
        //                 this,
        //                 this.geometry.x,
        //                 this.geometry.y
        //             )
        //         )
        //     });
    }


    public addApplication(application: ApplicationDeployment): void {
        this.applications.push(application);
        try {
            this.host.model.beginUpdate();
            this.addAndResize();
        } finally {
            this.host.model.endUpdate();
        }
    }

    addGridRow() : void {
        let geo = this.geometry;
        geo.height += (144 / this.scale);
        this.rows++;
    }

    addGridColumn() : void {
        let geo = this.geometry;
        geo.width += (144 / this.scale);
        this.columns++;
    }


    resizeGrid() : void {
        if(this.columns > this.rows) {
            this.addGridRow();
        } else {
            this.addGridColumn();
        }
    }

    packed() : boolean {
        return this.applications.length >
            this.rows * this.columns;
    }

    addAndResize() : void {
        if(this.packed()) {
            this.resizeGrid();
        }
        let geometry = this.geometry,
            rows = this.rows,
            columns = this.columns,
            len = this.applications.length;
        for(let idx = 0; idx < len; idx++) {
            let row = Math.floor(idx / columns),
                column = idx % columns;
            this.insertGridElement(
                column,
                row,
                this.applications[idx],
                geometry
            );
        }
        this.sizeChanged();
        // this.host.groupCells(this, 24, this.applications);
        this.host.model.setGeometry(this, geometry);
        this.host.refresh();
    }

    insertGridElement(
        column:number,
        row:number,
        application:ApplicationDeployment,
        geometry:mxGeometry
    ) {
        let scale = this.scale,
            applicationX = column * (144 / scale) + 24,
            applicationY = row * (144 / scale) + 48,
            applicationGeometry = application.geometry;
        applicationGeometry.x = applicationX;
        applicationGeometry.y = applicationY;
        applicationGeometry.width /= scale;
        applicationGeometry.height /= this.scale;
        application.addTo(this.host);
    }


    satisfy(context: EditorContext): void {

    }

    protected createNodeOverlay(): mxCellOverlay {
        let
            url = `assets/sui/themes/hasli/assets/images/icons/provider/generic/single-node-instance.svg`,
            image = new mxImage(url, 24, 24),
            iconOverlay = new mxCellOverlay(
                image,
                null,
                mxConstants.ALIGN_LEFT,
                mxConstants.ALIGN_TOP,
                null,
                // null,
                'default'
            );
        return iconOverlay;
    }


    protected createOverlays(): mxCellOverlay[] {
        return [this.createNodeOverlay()];
    }
}