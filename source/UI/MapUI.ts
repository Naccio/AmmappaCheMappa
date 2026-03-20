/// <reference path="../MapManager.ts" />
/// <reference path="../Layers/LayersPanel.ts" />
/// <reference path="DrawingArea.ts" />
/// <reference path="Tools/Toolbar.ts" />
/// <reference path="UIElement.ts" />

class MapUI implements UIElement {

    private container: HTMLDivElement;

    constructor(
        private map: MapManager,
        private toolbar: Toolbar,
        //HACK: Leaky abstraction
        public drawingArea: DrawingArea,
        private layersPanel: LayersPanel
    ) {
        const container = document.createElement('div');

        container.id = this.id;
        container.className = 'map-ui';

        this.container = container;
    }

    public get id() {
        return this.map.id + '-ui';
    }

    public build() {
        this.container.innerHTML = '';
        this.container.append(this.toolbar.build());
        this.container.append(this.drawingArea.build());
        this.container.append(this.layersPanel.build());

        return this.container;
    }

    public hide() {
        this.container.style.display = 'none';
    }

    public remove() {
        this.container.remove();
    }

    public show() {
        this.container.style.display = 'grid';
    }
}