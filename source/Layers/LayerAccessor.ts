/// <reference path="../Model/MapLayer.ts" />
/// <reference path="../Rendering/LayerRenderer.ts" />

class LayerAccessor {
    public constructor(public readonly data: MapLayer, public readonly drawing: DrawingLayer, public readonly renderer: LayerRenderer) {
    }
}