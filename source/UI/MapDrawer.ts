import { DrawingLayer } from "../Maps/Layers/DrawingLayer";
import { LayerAccessor } from "../Maps/Layers/LayerAccessor";
import { MapManager } from "../Maps/MapManager";
import { MathHelper } from "../Utilities/MathHelper";
import { Point } from "../Model/Point";
import { Vector } from "../Model/Vector";
import { Store } from "../Engine/Store";
import { VectorMath } from "../Utilities/VectorMath";
import { DrawingUI } from "./DrawingUI";
import { UIElement } from "./UIElement";
import { LayerUIFactory } from "../Maps/Layers/LayerUIFactory";

export class MapDrawer implements UIElement {
    private readonly container: HTMLDivElement;
    private readonly _layers: Map<string, DrawingLayer>;

    private actualShift: Vector = VectorMath.zero;

    constructor(
        private mapManager: MapManager,
        private store: Store,
        private ui: DrawingUI,
        private layerUi: LayerUIFactory
    ) {
        const container = document.createElement('div');

        container.style.position = 'absolute';

        container.append(ui.html);

        this.container = container;
        this._layers = new Map<string, DrawingLayer>();

        mapManager.layers.onCreate(this.layerCreateHandler);
        mapManager.layers.onDelete(this.layerDeleteHandler);

        mapManager.layers.layers.forEach(l => {
            this.layerCreateHandler(l);
        })
    }

    public get html() {
        return this.container;
    }

    private get layers(): DrawingLayer[] {
        return [...this._layers.values(), this.ui];
    }

    private get currentShift() {
        return this.map.position;
    }

    private get map() {
        return this.mapManager.mapAccessor.map;
    }

    public center() {
        this.shift(VectorMath.multiply(this.currentShift, -1));
    }

    public getMapPoint(viewportPoint: Point): Point {
        return VectorMath.subtract(viewportPoint, this.actualShift);
    }

    public resize(direction: number) {
        const map = this.map,
            min = 1,
            max = 5,
            currentZoom = map.zoom,
            newZoom = MathHelper.clamp(currentZoom + direction, min, max);

        map.zoom = newZoom;

        this.computeSize();
        //TODO: Adapt shift to zoom
        this.shift(VectorMath.zero);

        this.store.saveMap(map);
        this.layers.forEach(l => l.zoom());
    }

    public shift(vector: Vector) {
        this.map.position = VectorMath.add(this.currentShift, vector);
        this.actualShift = this.computeActualShift();

        this.container.style.left = this.actualShift.x + 'px';
        this.container.style.top = this.actualShift.y + 'px';

        this.store.saveMap(this.map);
    }

    private computeActualShift() {
        const container = this.container,
            parent = container.parentElement;

        if (!parent) {
            throw new Error('Map drawer not set up correctly.');
        }

        const shiftToCenter = {
            x: (parent.clientWidth - container.clientWidth) / 2,
            y: (parent.clientHeight - container.clientHeight) / 2
        };

        return VectorMath.add(this.currentShift, shiftToCenter);
    }

    private computeSize() {
        const map = this.map,
            mapData = map.data,
            multiplier = mapData.pixelsPerCell / map.zoom;

        this.container.style.width = mapData.columns * multiplier + 'px';
        this.container.style.height = mapData.rows * multiplier + 'px';
    }

    private layerCreateHandler = (c: LayerAccessor) => {
        const drawing = this.layerUi.createDrawing(this.mapManager, c.value),
            renderer = this.layerUi.createRenderer(this.mapManager, c.value);

        this._layers.set(c.id, drawing);
        this.container.append(drawing.html);
        renderer.render();
        c.subscribe(l => drawing.html.style.display = l.hidden ? 'none' : 'block');
    }

    private layerDeleteHandler = (c: LayerAccessor) => {
        const element = document.getElementById(c.id);

        this._layers.delete(c.id);
        element?.remove();
    }
}