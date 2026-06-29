import { MapLayer } from "../../Model/MapLayer";
import { MapManager } from "../MapManager";
import { LayerAbstractFactory } from "./LayerAbstractFactory";

export class LayerUIFactory {

    public constructor(
        private readonly factories: LayerAbstractFactory[],
    ) {
    }

    public createDrawing(map: MapManager, layer: MapLayer) {
        return this.getFactory(layer.type).createDrawing(map, layer.id);
    }

    public createRenderer(map: MapManager, layer: MapLayer) {
        return this.getFactory(layer.type).createRenderer(map, layer.id);
    }

    private getFactory(type: string) {
        const factory = this.factories.find(f => f.type === type);

        if (factory === undefined) {
            throw new Error('Could not find layer factory for type ' + type);
        }

        return factory;
    }
}