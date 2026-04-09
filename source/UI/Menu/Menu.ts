import { UIElement } from "../UIElement";
import { SubmenuMenuEntry } from "./SubmenuMenuEntry";

export class Menu implements UIElement {
    private container: HTMLDivElement;

    constructor(private mainEntry: SubmenuMenuEntry) {
        const container = document.createElement('div'),
            elements = this.mainEntry.build();

        container.id = 'menu';

        for (let element of elements) {
            container.append(element);
        }

        this.container = container;
    }

    public get html() {
        return this.container;
    }
}