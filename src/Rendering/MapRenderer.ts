/// <reference path="CanvasDrawer.ts" />
/// <reference path="RenderedMap.ts" />

class MapRenderer {
    constructor(private mapAccessor: MapAccessor, private layers: LayersManager) {
    }

    render(): RenderedMap {
        const map = this.mapAccessor.map,
            canvas = document.createElement('canvas');

        canvas.width = map.columns * map.pixelsPerCell;
        canvas.height = map.rows * map.pixelsPerCell;

        var ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawer = new CanvasDrawer(canvas);

        for (let layer of this.layers.layers) {
            layer.renderer.render(drawer);
        }

        return canvas;
    }
}