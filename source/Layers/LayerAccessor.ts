/// <reference path="../Events/Observable.ts" />
/// <reference path="../Model/MapLayer.ts" />
/// <reference path="../Rendering/LayerRenderer.ts" />

class LayerAccessor extends Observable<MapLayer> {
    public constructor(
        data: MapLayer,
        public readonly drawing: DrawingLayer,
        public readonly renderer: LayerRenderer
    ) {
        super(data);
    }

    public get id() {
        return this.value.id;
    }
}