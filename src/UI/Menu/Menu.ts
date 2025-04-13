/// <reference path="./SubmenuMenuEntry.ts" />

class Menu implements UIElement {
    constructor(private mainEntry: SubmenuMenuEntry) {
    }

    public build() {
        const container = document.createElement('div'),
            elements = this.mainEntry.build();

        container.id = 'menu';

        for (let element of elements) {
            container.append(element);
        }

        document.body.append(container);
    }
}