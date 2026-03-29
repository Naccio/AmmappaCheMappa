/// <reference path="../MapAccessor.ts" />
/// <reference path="../Rendering/LayerRenderer.ts" />
/// <reference path="../UI/CanvasProvider.ts" />
/// <reference path="DrawingLayer.ts" />
/// <reference path="GridLayer.ts" />
/// <reference path="LayerAbstractFactory.ts" />

class GridLayerFactory implements LayerAbstractFactory {

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