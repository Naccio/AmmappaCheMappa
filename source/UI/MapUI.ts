import { LayersPanel } from "../Maps/Layers/LayersPanel";
import { MapManager } from "../Maps/MapManager";
import { DrawingArea } from "./DrawingArea";
import { Toolbar } from "./Tools/Toolbar";
import { UIElement } from "./UIElement";

export class MapUI implements UIElement {

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

    public show() {
        this.container.style.display = 'grid';
        this.drawingArea.setup();
    }
}