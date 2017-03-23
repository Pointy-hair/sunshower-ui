import {
    Layer,
    mxCell,
    mxConstants,
    mxImage,
    Renderable,
    mxGeometry,
    mxRectangle,
    SceneGraphElement
} from 'mxgraph';
import {Vertex, Edge} from "common/lib/algorithms/graph";

import {
    Canvas,
    EditorContext
} from 'common/lib/canvas';


import {
    UUID,
    Kv,
    Registry
} from "common/lib/utils";


import {Class, Copyable} from "common/lib/lang";
import {mxCellOverlay} from "mxgraph";
import {Rectangle} from "common/lib/geometry";
import {Element} from 'common/lib/canvas/element';

export type Properties = {[key: string]: any};


export interface Element extends
    SceneGraphElement,
    Renderable,
    Layer,
    Copyable<Element>,
    Vertex<Properties>
{

    getSuccessors(): Element[];

    getPredecessors(): Element[];

    setParent(element:Element) : void;

    addTo(canvas: Canvas,
          parent: Layer,
          relative: boolean);

    addElement(element: Element): void;

    beforeAdd(context: Canvas): void;

    afterAdd(context: Canvas): void;

    beforeRemove(context: Canvas): void;

    afterRemove(context: Canvas): void;
}

export interface BlockMember<T> {
    copyInto(canvas: Canvas, parent: Layer, x: number, y: number): T;
}


type PropertyNode = Vertex<Properties>;

type ElementRelationship = number;

export class Relationship implements Edge<Properties> {

    static readonly SUCCESSOR: number = 0;
    static readonly PREDECESSOR: number = 1;


    constructor(public source: PropertyNode,
                public target: PropertyNode,
                public relationship: number) {
        this.relationship = relationship;

    }

}

export class ElementProperties {
    static readonly COLLAPSIBLE: string = 'collapsible';
}

export interface ElementFactory<E extends Element> {
    create(model: EditorContext,
           registry: Registry): E;

    getProperty(key: string): any;

    setProperty(key: string, value: any);


}

export class Elements {


    static pluckLayers(cells: Layer[]): Element[] {
        let results = [];
        for (let cell of cells) {
            if (cell.getAttribute('element')) {
                results.push(cell as Element);
            }
        }
        return results;
    }

    static aggregate(selection: Layer[]): {[key: string]: Element} {
        let result = {};
        for (let select of selection) {
            result[select.id] = selection;
        }
        return result;
    }


    static resolveRoots(cells: Layer[]): Element[] {
        let results = [],
            duplicates = {},
            selected = Elements.aggregate(cells);
        for (let cell of cells) {
            let root = Elements.resolveRoot(cell, selected);
            if (root && root.getAttribute('element') && !duplicates[root.id]) {
                results.push(root);
                duplicates[root.id] = true;
            }
        }
        return results;
    }


    static resolveRootAndLevel(cell: Element,
                               selected: {[key: string]: Element},
                               level: number): [Element, number] {
        if (selected[cell.id]) {
            let predecessors = cell.getPredecessors();
            if (predecessors && predecessors.length) {
                let max = level,
                    root = cell;
                for (let predecessor of predecessors) {
                    if (selected[predecessor.id]) {
                        let [element, height] = Elements.resolveRootAndLevel(
                            predecessor,
                            selected,
                            level + 1
                        );
                        if (element && selected[element.id]) {
                            if (height > max) {
                                max = height;
                                root = element;
                            }
                        } else {
                            root = predecessor;
                        }
                    }
                }
                return [root, max];
            } else {
                return [cell, level];
            }
        }
        return [null, null];
    }

    static resolveRoot(cell: Layer, selected: {[key: string]: Element}): Element {
        if (cell.getAttribute('element')) {
            let element = Elements.resolveRootAndLevel(
                cell as Element,
                selected, 0
            );
            if (element) {
                return element[0];
            }
        } else {
            return null;
        }
    }


}

export abstract class AbstractElement extends mxCell implements Element, Vertex<Properties> {

    protected static createLoadingOverlay(): mxCellOverlay {
        let
            url = 'assets/sui/themes/hasli/assets/images/rolling.svg',
            image = new mxImage(url, 40, 40),
            iconOverlay = new mxCellOverlay(
                image,
                null,
                mxConstants.ALIGN_CENTER,
                mxConstants.ALIGN_MIDDLE,
                null,
                'default'
            );
        return iconOverlay;
    }


    private static readonly loadingOverlay: mxCellOverlay =
        AbstractElement.createLoadingOverlay();


    public id: string;
    public icon: string;
    public name: string;
    public host: Canvas;
    public readonly data: Properties;
    private cellOverlays: mxCellOverlay[];
    private readonly attributes: {[key: string]: string};
    public readonly adjacencies: {[key: string]: Edge<Properties>};
    private readonly childNodes: PropertyNode[];


    static count = 0;


    public location: Rectangle;

    constructor() {
        super();
        this.id = UUID.randomUUID().value;
        this.data = {};
        this.adjacencies = {};
        this.attributes = {};
        this.setVertex(true);
        this.setStyle(this.createStyle());
        this.childNodes = [];
        this.setAttribute('element', '1');
    }

    copy(): Element {
        return this;
    }

    beforeAdd(context: Canvas): void {
        this.host = context;
    }

    afterAdd(context: Canvas): void {

    }

    beforeRemove(context: Canvas): void {

    }

    afterRemove(context: Canvas): void {

    }

    addTo(context: Canvas, parent: Layer, relative: boolean): Layer {
        this.beforeAdd(context);
        this.setParent(parent);
        let result = this.host.addCell(this, parent);
        this.recomputeLocation(parent);
        let overlays = this.createOverlays();
        this.cellOverlays = overlays;
        for (let overlay of overlays) {
            this.host.addCellOverlay(result, overlay);
        }
        this.afterAdd(context);
        return result;
    }

    public addElement(e: Element): void {
        if (e) {
            let pnode = e as any as PropertyNode;
            this.addSuccessor(pnode);
        }
    }

    private recomputeLocation(parent: Layer) {

    }


    setLabel(label: string): void {
        this.attributes['label'] = label;
    }

    getLabel(): string {
        return this.attributes['label'];
    }

    getAdjacencies(relationship: ElementRelationship): PropertyNode[] {
        let results = [];
        for (let k in this.adjacencies) {
            let v = this.adjacencies[k];
            if (v.relationship === relationship) {
                results.push(v.target);
            }
        }
        return results;
    }

    createEdge(source: PropertyNode,
               target: PropertyNode,
               relationship?: number): Relationship {
        return new Relationship(
            source,
            target,
            relationship || Relationship.SUCCESSOR
        );
    }

    addEdge(edge: Relationship): boolean {
        if (this.adjacencies[edge.target.id]) {
            return false;
        }
        this.adjacencies[edge.target.id] = edge;
        return true;
    }


    addPredecessor(predecessor: PropertyNode): boolean {
        let id = this.createId(predecessor, Relationship.PREDECESSOR);
        if (this.adjacencies[id]) {
            return false;
        }
        this.adjacencies[id] = this.createEdge(
            this,
            predecessor,
            Relationship.PREDECESSOR
        );
        return true;

    }

    removePredecessor(predecessor: PropertyNode): boolean {
        let id = this.createId(predecessor, Relationship.PREDECESSOR);
        if (!this.adjacencies[id]) {
            return false;
        }
        delete this.adjacencies[id];
    }

    protected createId(node: PropertyNode, relationship: number) {
        return node.id + relationship;
    }


    hasChildren(): boolean {
        return this.childNodes && this.childNodes.length > 0;
    }

    getChildren(): PropertyNode[] {
        return this.childNodes;
    }


    addSuccessor(successor: PropertyNode): boolean {
        // let id = this.createId(successor, Relationship.SUCCESSOR);
        // if (this.adjacencies[id]) {
        //     return false;
        // }
        this.childNodes.push(successor);
        return true;
    }

    removeEdge(target: Relationship): boolean {
        return this.removeSuccessor(target.target);
    }

    removeSuccessor(successor: PropertyNode): boolean {
        // let id = this.createId(successor, Relationship.SUCCESSOR);
        // let t = this.adjacencies[id];
        // if (t) {
        //     delete this.adjacencies[id];
        //     return true;
        // }
        return false;
    }


    toString(): string {
        let result = `${this.id} -> `;
        for (let k in this.adjacencies) {
            result += k + ',';
        }
        return result;
    }


    getSuccessors(): Element[] {
        return this.getAdjacencies(Relationship.SUCCESSOR) as any as Element[];
    }

    getPredecessors(): Element[] {
        return this.getAdjacencies(Relationship.PREDECESSOR) as any as Element[];
    }


    getChildrenOfType<U>(childType: any): U[] {
        let results = [];
        for (let i = 0; i < this.getChildCount(); i++) {
            let child = this.getChildAt(i);
            if (child instanceof childType) {
                results.push(child);
            }
        }
        return results;
    }

    protected set(attributeName: string, attributeValue: string, set: boolean): void {
        if (set) {
            this.setAttribute(attributeName, attributeValue);
        } else {
            delete this.attributes[attributeName];
        }
    }

    setAncestor(parent: boolean): void {
        this.set('synthetic', '1', parent);
    }

    setCollapsable(collapsable: boolean) {
        this.set(ElementProperties.COLLAPSIBLE, '1', collapsable);
    }


    addChild(child: Layer): void {
        this.insert(child);
    }


    refresh() {
        for (let overlay of this.cellOverlays) {
            this.host.removeCellOverlay(this, overlay);
        }

        this.cellOverlays = this.createOverlays();
        for (let overlay of this.cellOverlays) {
            this.host.addCellOverlay(this, overlay);
        }

    }

    protected createOverlays(): mxCellOverlay[] {
        return [];
    }


    getAttribute(key: string): string {
        return this.attributes && this.attributes[key];
    }

    setAttribute(key: string, value: string) {
        this.attributes[key] = value;
    }


    setComponent(component: boolean): void {
        if (component) {
            this.setAttribute('constituent', '1');
        } else {
            if (this.attributes) {
                delete this.attributes['constituent'];
            }
        }
    }

    protected sizeChanged(): void {
        if (this.children) {
            for (let child of this.children) {
                if (child instanceof AbstractElement) {
                    (<AbstractElement> child).sizeChanged();
                }
            }
        }
    }

    protected createCss(): Kv {
        return Kv.create(';')
            .pair('shape', 'label')
            .pair('imageWidth', 24)
            .pair('imageHeight', 24)
            .pair('fillOpacity', 0)
            .pair('strokeColor', '#B8B8B8')
            .pair('verticalAlign', 'bottom')
            .pair('spacingBottom', '24')
            .pair('verticalLabelPosition', mxConstants.ALIGN_CENTER)
            .pair('labelPosition', mxConstants.ALIGN_MIDDLE)
            .pair('fontColor', '#000000')
            .pair('fontStyle', mxConstants.FONT_BOLD)
    }

    protected createStyle(): string {
        return this.createCss().toString();
    }

    public setLoading(): void {
        this.host.addCellOverlay(
            this,
            AbstractElement.loadingOverlay
        );
    }

    public stopLoading(): void {
        this.host.removeCellOverlay(
            this,
            AbstractElement.loadingOverlay
        );
    }



}


export abstract class AbstractElementFactory<E extends Element> implements ElementFactory<E> {

    properties: {[key: string]: any};


    setProperty(key: string, value: any) {
        if (!this.properties) {
            this.properties = {};
        }
        this.properties[key] = value;
    }

    getProperty(key: string): any {
        if (this.properties) {
            return this.properties[key];
        }
        return null;
    }

    getBounds(canvas: Canvas, roots: Layer[]): mxRectangle {
        let boundingBox = canvas.view.getBounds(roots),
            scale = canvas.view.scale,
            tx = canvas.view.translate.x,
            ty = canvas.view.translate.y;
        boundingBox.x -= tx * scale;
        boundingBox.y -= ty * scale;

        boundingBox.x /= scale;
        boundingBox.y /= scale;
        boundingBox.width /= scale;
        boundingBox.height /= scale;

        return boundingBox;
    }

    getGeometry(canvas: Canvas, roots: Layer[]): mxGeometry {
        let boundingBox = this.getBounds(canvas, roots),
            scale = canvas.view.scale,
            geometry = new mxGeometry(
                boundingBox.x - (48 * scale),
                boundingBox.y - (48 * scale),
                boundingBox.width + (96 * scale),
                boundingBox.height + (96 * scale)
            );
        return geometry;
    }


    abstract create(model: EditorContext,
                    registry: Registry): E;
}

export interface EditorMode {
    name            ?: string;
    viewState       ?: string;
    data            ?: any;
}

export interface ElementEditor<E extends Element> {
    mode ?: EditorMode;

    open(e: E): void;
}

export interface EditableElement<
    E extends Element,
    T extends ElementEditor<E>
    > {


    /**
     *
     * @param role
     */
    hasEditorOfRole(role:string) : boolean;


    /**
     *
     * @param role
     */
    getEditorOfRole(role:string) : Class<T>;

}
