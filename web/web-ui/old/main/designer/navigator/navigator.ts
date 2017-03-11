import {Router} from 'aurelia-router';
import {bindable, inject} from 'aurelia-framework';


@inject(Router)
export class Navigator {

    @bindable
    loading: boolean = false;

    constructor(private router:Router) {

    }

    create() : void {
        this.loading = true;
        this.router.navigate('workspace/draftboard');
    }

}