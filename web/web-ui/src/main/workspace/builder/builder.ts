/**
 * Created by dustinlish on 11/9/16.
 */

import * as cytoscape from 'cytoscape';
import * as gridGuide from 'cytoscape-grid-guide'
import {inject} from 'aurelia-framework';
import {ImageDescriptor} from '../../../model/hal/image'
import {HttpClient} from "aurelia-fetch-client";


@inject(HttpClient)
export class Builder {

    private leftVisible: boolean = true;
    private rightVisible: boolean = true;
    private expanded: number = 2;
    private states: {[key: number]: string} = {};


    private graphInstance:any;
    private graph: HTMLElement;

    private leftSidebar: HTMLElement;

    private rightSidebar: HTMLElement;

    constructor(private client:HttpClient) {
        this.states[2] = "ten";
        this.states[0] = "sixteen";
        this.states[1] = "thirteen";
    }


    public attached(): void {
        this.configureWorkspace();
        this.configureSidebars();
    }

    private configureWorkspace(): void {
        let cy = cytoscape({
            container: this.graph,
            ready: (e) => {
                gridGuide(cytoscape);
            },
            elements: [],
        });
        this.graphInstance = cy;
        (<any>window).cy = cy;

        cy.gridGuide({
            snapToGrid:true,
            discreteDrag:true,
            guidelines:true,
            panGrid:true
        });
    }

    toggleLeft() {
        this.leftVisible = this.toggle(
            this.leftSidebar,
            this.leftVisible,
            'right'
        );
    };

    onImageAdded(e:Event) : void {
        let value = (<any>e).detail.value;

        this.client.fetch(`docker/images/${value}`)
            .then(r => r.json())
            .then(r => this.add(r));
    }

    add(imageDescriptor: ImageDescriptor) {
        console.log(imageDescriptor.logo_url.large)

        this.graphInstance.add([{
            group: 'nodes',
            data: {
                id: imageDescriptor.id,
            },
            css: {
                // "background-image": 'url(https://upload.wikimedia.org/wikipedia/en/6/63/Basho-logo-small.gif)'
            }
        }])
    }


    toggleRight() {
        this.rightVisible = this.toggle(
            this.rightSidebar,
            this.rightVisible,
            'left'
        );

    }

    private getCenterWidth(count: number): void {


    }

    private configureSidebars(): void {

    }

    private computeExpanded(visible: boolean) {
        return visible ? -1 : 1;
    }

    private toggle(ele:HTMLElement, v :boolean, direction:string) :boolean {

        let visible = v,
            expanded = this.computeExpanded(visible),
            previous = this.states[this.expanded],
            next = this.states[this.expanded + expanded];
        $(this.graph).removeClass(previous);
        console.log("previous", previous);
        this.prependClass(this.graph, next);
        console.log("next", next);
        if(visible) {
            visible = false;
            $(ele).hide();
        } else {
            visible = true;
            $(ele).show();
        }
        this.expanded += expanded;

        this.graphInstance.gridGuide({
            snapToGrid:true,
            discreteDrag:true,
            guidelines:true,
            panGrid:true
        });
        return visible;
    }

    prependClass(sel, strClass) {
        var el = $(sel);
        var classes = el.attr('class');
        classes = strClass + ' ' + classes;
        el.attr('class', classes);
    }
}