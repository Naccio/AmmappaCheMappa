import { CellRenderer } from "../Cells/CellRenderer";
import { LayerRenderer } from "./LayerRenderer";
import { DefaultLayer } from "./DefaultLayer";
import { DrawingLayer } from "./DrawingLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { CellManager } from "../Cells/CellManager";
import { MapData } from "../../Model/MapData";

export class DefaultLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: DefaultLayer }[] = [];

    constructor(
        private _type: string,
        private map: MapData,
        private drawerFactory: DrawerFactory,
        private renderer: CellRenderer,
        private cells: CellManager[]) {
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
            const map = this.map,
                drawer = this.drawerFactory.create(id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell);

            layer = {
                id,
                layer: new DefaultLayer(id, this.cells, drawer, this.renderer)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}