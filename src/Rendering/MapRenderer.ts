/// <reference path="../UI/Layers/DrawingLayer.ts" />
/// <reference path="CanvasDrawer.ts" />
/// <reference path="RenderedMap.ts" />

class MapRenderer {
    constructor(private mapAccessor: MapAccessor, private layers: DrawingLayer[]) {
    }

    render() : RenderedMap {
        const map = this.mapAccessor.map,
            canvas = document.createElement('canvas');

        canvas.width = map.columns * map.pixelsPerCell;
        canvas.height = map.rows * map.pixelsPerCell;

        var ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawer = new CanvasDrawer(canvas);

        for (let layer of this.layers) {
            layer.render(drawer);
        }

        return canvas;
    }
}