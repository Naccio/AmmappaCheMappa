/// <reference path="CanvasDrawer.ts" />
/// <reference path="RenderedMap.ts" />

class MapRenderer {

    render(mapManager: MapManager): RenderedMap {

        const map = mapManager.mapAccessor.map.data,
            canvas = document.createElement('canvas'),
            layers = mapManager.layers.layers.filter(l => !l.data.hidden);

        canvas.width = map.columns * map.pixelsPerCell;
        canvas.height = map.rows * map.pixelsPerCell;

        var ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawer = new CanvasDrawer(canvas);

        for (let layer of layers) {
            layer.renderer.render(drawer);
        }

        return canvas;
    }
}