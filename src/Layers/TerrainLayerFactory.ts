/// <reference path="DefaultLayer.ts" />
/// <reference path="LayerAbstractFactory.ts" />

class TerrainLayerFactory implements LayerAbstractFactory {

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public type = 'terrain';

    createRenderer(): LayerRenderer {
        return new DefaultLayer(this.mapAccessor, this.canvasProvider, this.renderer);
    }

    createDrawing(): DrawingLayer {
        return new DefaultLayer(this.mapAccessor, this.canvasProvider, this.renderer);
    }
}