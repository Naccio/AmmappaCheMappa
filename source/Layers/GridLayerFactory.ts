/// <reference path="../MapAccessor.ts" />
/// <reference path="../Rendering/LayerRenderer.ts" />
/// <reference path="../UI/CanvasProvider.ts" />
/// <reference path="DrawingLayer.ts" />
/// <reference path="GridLayer.ts" />
/// <reference path="LayerAbstractFactory.ts" />

class GridLayerFactory implements LayerAbstractFactory {

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
    }

    public type = 'grid';

    createRenderer(id: string): LayerRenderer {
        return new GridLayer(id, this.mapAccessor, this.canvasProvider);
    }

    createDrawing(id: string): DrawingLayer {
        return new GridLayer(id, this.mapAccessor, this.canvasProvider);
    }
}