/// <reference path="Layers/LayersManager.ts" />
/// <reference path="MapAccessor.ts" />

class MapManager {
    constructor(public mapAccessor: MapAccessor, public layers: LayersManager) {
    }
}