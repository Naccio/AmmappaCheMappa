import { MapAccessor } from "../MapAccessor";
import { LayerRenderer } from "./LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";
import { GridLayer } from "./GridLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../MapManager";

export class GridLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: GridLayer }[] = [];

    constructor(
        private drawerFactory: DrawerFactory
    ) {
    }

    public get type() {
        return 'grid';
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
            layer = {
                id,
                layer: new GridLayer(id, map.mapAccessor, this.drawerFactory)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}