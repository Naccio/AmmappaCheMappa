import { MapAccessor } from "../Engine/MapAccessor";
import { LayerRenderer } from "../Rendering/LayerRenderer";
import { CanvasProvider } from "../UI/CanvasProvider";
import { DrawingLayer } from "./DrawingLayer";
import { GridLayer } from "./GridLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";

export class GridLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: GridLayer }[] = [];

    constructor(
        private mapAccessor: MapAccessor,
        private canvasProvider: CanvasProvider
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
                layer: new GridLayer(id, this.mapAccessor, this.canvasProvider)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}