import { MapAccessor } from "../MapAccessor";
import { CellRenderer } from "../Cells/CellRenderer";
import { LayerRenderer } from "./LayerRenderer";
import { DefaultLayer } from "./DefaultLayer";
import { DrawingLayer } from "./DrawingLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";

export class DefaultLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: DefaultLayer }[] = [];

    constructor(
        private _type: string,
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory,
        private renderer: CellRenderer) {
    }

    public get type() {
        return this._type;
    }

    createRenderer(id: string): LayerRenderer {
        return this.getLayer(id);
    }

    createDrawing(id: string): DrawingLayer {
        return this.getLayer(id);
    }

    private getLayer(id: string) {
        let layer = this.layers.find(l => l.id === id);

        if (!layer) {
            const map = this.mapAccessor.map,
                mapData = map.data,
                drawer = this.drawerFactory.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell);

            layer = {
                id,
                layer: new DefaultLayer(id, this.mapAccessor, drawer, this.renderer)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}