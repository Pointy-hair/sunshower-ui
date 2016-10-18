import 'jquery'
import {Aurelia} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';


export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    let container = aurelia.container;

    let http = new HttpClient();
    http.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl('/hasli/api/v1/')
            .withDefaults({
                headers: {
                    // 'Authorization': tokenVariable // <---- your magic here
                }
            })
    });

    container.registerInstance(HttpClient, http);


    aurelia.start().then(() => aurelia.setRoot());
}