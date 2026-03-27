/// <reference path="DefaultLayer.ts" />
/// <reference path="LayerAbstractFactory.ts" />
/// <reference path="../UI/CanvasProvider.ts" />

class DefaultLayerFactory implements LayerAbstractFactory {

    private readonly layers: { id: string, layer: DefaultLayer }[] = [];

    constructor(
        private _type: string,
        private mapAccessor: MapAccessor,
        private canvasProvider: CanvasProvider,
        private renderer: CellRenderer) {
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
            const map = this.mapAccessor.map,
                mapData = map.data,
                drawer = this.canvasProvider.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);

            layer = {
                id,
                layer: new DefaultLayer(id, this.mapAccessor, drawer, this.renderer)
            };

            this.layers.push(layer);
        }

        return layer.layer;
    }
}