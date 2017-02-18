
import {HttpClient} from 'aurelia-fetch-client';
import {bindable, inject} from "aurelia-framework";
import {Workspaces} from "apps/workspaces/routes/workspace/index";
@inject(Workspaces, HttpClient)
export class Applications {

    @bindable
    applications: Application[];

    @bindable
    loading: boolean;

    constructor(private parent:Workspaces, private client:HttpClient) {
    }


    activate(id:any) : void {
        this.parent.setMenuVisible(true);
    }

    attached(): void {
        this.refresh();
    };

    refresh(): void {
        this.loading = true;
        setTimeout(() => {
            this.client.fetch('applications')
                .then(d => d.json() as any)
                .then(d => {
                    this.loading = false;
                    this.applications = d;
                });
        }, 2)
    }

    addApplication() : void {
        this.parent.router.navigate('applications/new');
    }
}

export class Application {
    logo    ?: string;
    name    ?: string;
    status  ?: string;
    ip      ?: string;
    ports   ?: string;
    cpu     ?: number;
    memory  ?: number;
    disk    ?: number;
}