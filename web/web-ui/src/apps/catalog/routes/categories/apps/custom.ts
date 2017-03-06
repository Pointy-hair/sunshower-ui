/**
 * Created by dustinlish on 2/27/17.
 */
import {Catalog} from "apps/catalog/index";
import {HttpClient} from "aurelia-fetch-client";
import {bindable, autoinject} from "aurelia-framework";
import {Application} from "common/model/api/core/application";

@autoinject
export class Custom {


    @bindable
    applications: Application[];

    @bindable
    loading: boolean;
    constructor(private parent: Catalog, private client:HttpClient) {
    }


    attached() : void {
        this.loading = true;
        setTimeout(() => {
            this.client.fetch(`workspaces/${this.parent.id}/applications/heads`)
                .then(d => d.json() as any)
                .then(d => {
                    this.loading = false;
                    this.applications = d;
                })
                .catch(err => {
                    console.log("Err");
                    this.loading = false;
                });
        }, 500)
    }
}