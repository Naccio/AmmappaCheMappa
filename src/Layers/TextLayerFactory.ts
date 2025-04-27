class TextLayerFactory implements LayerAbstractFactory {

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public type = 'text';

    createRenderer(): LayerRenderer {
        return new DefaultLayer(this.type, this.mapAccessor, this.canvasProvider, this.renderer);
    }

    createDrawing(): DrawingLayer {
        return new DefaultLayer(this.type, this.mapAccessor, this.canvasProvider, this.renderer);
    }
}