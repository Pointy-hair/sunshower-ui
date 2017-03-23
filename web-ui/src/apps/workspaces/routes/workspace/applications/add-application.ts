import {
    bindable,
    inject,
    NewInstance
} from "aurelia-framework";
import {HttpClient} from 'aurelia-fetch-client';

import {
    ValidationController,
    ValidationRules
} from 'aurelia-validation';
import {BootstrapFormRenderer} from 'common/resources/custom-components/bootstrap-form-renderer';

import {Workspace} from "apps/workspaces/routes/workspace/index";

@inject(Workspace, HttpClient, NewInstance.of(ValidationController))
export class AddApplication {

    @bindable
    visible: boolean;

    @bindable
    private application:ApplicationDescriptor;

    @bindable
    private files:FileList;

    @bindable
    private uploadStatus:string = 'none'; //none, uploading, done, error

    constructor(
        private parent:Workspace,
        private client:HttpClient,
        private controller:ValidationController
    ) {
        this.controller.addRenderer(new BootstrapFormRenderer());
    }

    attached(): void {
        this.setupValidation();
        this.setupFileUpload();
    }

    activate() : void {
        this.parent.setMenuVisible(false);
    }


    saveApplication() : void {
        this.controller.validate().then(result => {
            if (result.valid) {
                this.client.fetch('application', {
                    method: 'post',
                    body: JSON.stringify(this.application)
                }).then(t => this.close());
            }
        });
    }

    setupValidation() : void {
        //            .ensure((p:Provider) => p.key).required().satisfies(p => p.length === 3)
        //.withMessage('Key must be exactly three characters long')
        let validationRules = ValidationRules
            .ensure((ad:ApplicationDescriptor) => ad.name).required()
            .rules;
        this.controller.addObject(this.application, validationRules);
    }

    open() : void {
        this.visible = true;
        this.application = new ApplicationDescriptor();
    }

    close() : void {
        this.parent.router.navigateBack();
    }

    uploadFiles() : void {
        if (this.files) {
            this.uploadStatus = 'uploading';
            let formData = new FormData();
            $.each( this.files, function(i, file) {
                formData.append(file.name, file );
            });
            this.client.fetch('application_upload', {
                method: 'post',
                body: formData
            }).then(t => console.log("uploaded!", t)).then(t => this.uploadStatus = 'done');
            //TODO finish
        }
    }

    setupFileUpload() : void {
        let $form = $('.upload-box'),
            $input    = $form.find('input[type="file"]'),
            $label    = $form.find('.upload-box__file-label'),
            showFiles = function(files) {
                $label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', files.length ) : files[ 0 ].name);
            },
            isAdvancedUpload = function() {
            let div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }();
        if (isAdvancedUpload) {
            $form.addClass('has-advanced-upload');

            $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                })
                .on('dragover dragenter', function() {
                    $form.addClass('is-dragover');
                })
                .on('dragleave dragend drop', function() {
                    $form.removeClass('is-dragover');
                })
                .on('drop', function(e) {
                    this.files = (e.originalEvent as DragEvent).dataTransfer.files;
                    showFiles( this.files );
                    //todo fix
                });
        }

        $input.on('change', function(e) {
            showFiles((e as any).target.files);
        });
    }

}
//https://css-tricks.com/drag-and-drop-file-uploading/

export class ApplicationDescriptor {
    name    ?: string;
    icon    ?: string;
    files   ?: string[];
}