import { MapAccessor } from "../MapAccessor";
import { LayerRenderer } from "./LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";
import { GridLayer } from "./GridLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";

export class GridLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: GridLayer }[] = [];

    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory
    ) {
    }

    public get type() {
        return 'grid';
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
            layer = {
                id,
                layer: new GridLayer(id, this.mapAccessor, this.drawerFactory)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}