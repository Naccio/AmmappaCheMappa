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
        private drawingArea: DrawingArea,
        private layersPanel: LayersPanel
    ) {
        const container = document.createElement('div');

        container.id = this.id;
        container.className = 'map-ui';

        container.append(this.toolbar.html);
        container.append(this.drawingArea.html);
        container.append(this.layersPanel.html);

        this.container = container;
    }

    public get id() {
        return this.map.id + '-ui';
    }

    public get html() {
        return this.container;
    }

    public hide() {
        this.container.style.display = 'none';
    }

    public remove() {
        this.container.remove();
    }

    public setup() {
        const mapAccessor = this.map.mapAccessor,
            layersManager = this.map.layers,
            map = mapAccessor.map;

        mapAccessor.map.data.layers.forEach(l => layersManager.add(l));
        layersManager.select(map.activeLayer);

        this.drawingArea.setup();
    }

    public show() {
        this.container.style.display = 'grid';
    }
}