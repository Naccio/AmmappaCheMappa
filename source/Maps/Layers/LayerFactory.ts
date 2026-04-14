import { MapLayer } from "../../Model/MapLayer";
import { LayerAbstractFactory } from "./LayerAbstractFactory";
import { LayerAccessor } from "./LayerAccessor";

export class LayerFactory {

    public constructor(private factories: LayerAbstractFactory[]) {
    }

    public create(layer: MapLayer): LayerAccessor {
        const factory = this.getFactory(layer.type);

        return new LayerAccessor(
            layer,
            factory.createDrawing(layer.id),
            factory.createRenderer(layer.id)
        );
    }

    private getFactory(type: string) {
        const factory = this.factories.find(f => f.type === type);

        if (factory === undefined) {
            throw new Error('Could not find layer factory for type ' + type);
        }

        return factory;
    }
}