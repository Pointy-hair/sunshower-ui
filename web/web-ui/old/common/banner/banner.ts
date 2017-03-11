import {
    bindable,
    inject,
    containerless
} from 'aurelia-framework';
import {Carousel} from "common/carousel/carousel";
import {CarouselViewModel} from "common/carousel/carousel-item";
import {Subject} from 'rx';
@containerless
export class Banner {


    public static visible: boolean;

    public static instance: Banner;

    public static toggling: boolean = true;

    @bindable
    public visible: boolean;

    public carousel: Carousel;

    public container: HTMLElement;

    public static visibility: Subject<boolean> = new Subject<boolean>();

    @bindable
    public label: string;

    @bindable
    private items: CarouselViewModel[];

    constructor() {

    }


    public static getOffsetAndHeight(): [number, number] {
        if (Banner.visible && Banner.instance) {
            let instance = Banner.instance,
                container = $(instance.container).find('.carousel-container'),
                offset = $(container).offset(),
                height = $(container).height();
            return [offset.top, height];
        }
        return [0, 0];

    }


    public static setToggling(toggling: boolean): void {
        Banner.toggling = toggling;
    }

    public static setVisible(visible: boolean): void {
        Banner.visible = visible;
    }

    attached() {
        this.toggle();
        if (!Banner.instance) {
            Banner.instance = this;
        }
    }

    open(): void {
        $(this.container).show();
        this.carousel.open(this.items);
        Banner.visibility.next(true);
    }

    close(): void {
        $(this.container).hide();
        this.carousel.close();
        Banner.visibility.next(false);
    }

    public static open(): void {
        if (Banner.instance) {
            Banner.instance.open();
        }
    }

    public static close(): void {
        if (Banner.instance) {
            Banner.instance.close();
        }
    }

    public static toggle() {
        if (Banner.instance) {
            let instance = Banner.instance;
            instance.toggle();
        }
    }


    toggle(): void {
        if (Banner.toggling) {
            if (this.visible) {
                this.close();
            } else {
                this.open();
            }
            this.visible = !this.visible;
        }
    }
}