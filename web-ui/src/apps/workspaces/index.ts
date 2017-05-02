import {autoinject} from "aurelia-framework";

import {
    NavigatorManager
} from 'apps/workspaces/resources/custom-elements/navigator'


import {
    Router,
    RouterConfiguration
} from "aurelia-router";

@autoinject
export class WorkspaceApplication {

    constructor(private navigatorManager: NavigatorManager) {


    }


    public configureRouter(cfg: RouterConfiguration,
                           router: Router): void {

        cfg.map([{
            route: ['', 'list'],
            moduleId: './routes/workspaces',
            title: 'Workspaces'
        }, {
           route: 'create',
            moduleId: './routes/workspace/create/create',
            title: 'Create New Workspace'
        }, {
            route: ':workspaceId',
            moduleId: './routes/workspace/index',
            title: 'Workspace'
        }]);


        this.navigatorManager.bind(router);

    }


}