/// <reference path="DefaultLayer.ts" />
/// <reference path="LayerAbstractFactory.ts" />

class TerrainLayerFactory implements LayerAbstractFactory {

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public type = 'terrain';

    createRenderer(id: string): LayerRenderer {
        return new DefaultLayer(id, this.mapAccessor, this.canvasProvider, this.renderer);
    }

    createDrawing(id: string): DrawingLayer {
        return new DefaultLayer(id, this.mapAccessor, this.canvasProvider, this.renderer);
    }
}