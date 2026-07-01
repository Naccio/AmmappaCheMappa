import { CellRenderer } from "../Cells/CellRenderer";
import { LayerRenderer } from "./LayerRenderer";
import { DefaultLayer } from "./DefaultLayer";
import { DrawingLayer } from "./DrawingLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../MapManager";

export class DefaultLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: DefaultLayer }[] = [];

    constructor(
        private _type: string,
        private drawerFactory: DrawerFactory,
        private renderer: CellRenderer) {
    }

    public get type() {
        return this._type;
    }

    createRenderer(map: MapManager, id: string): LayerRenderer {
        return this.getLayer(map, id);
    }

    createDrawing(map: MapManager, id: string): DrawingLayer {
        return this.getLayer(map, id);
    }

    private getLayer(map: MapManager, id: string) {
        let layer = this.layers.find(l => l.id === id);

        if (!layer) {
            const mapData = map.mapAccessor.map.data,
                drawer = this.drawerFactory.create(mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell);

            layer = {
                id,
                layer: new DefaultLayer(id, map.cells, drawer, this.renderer)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}