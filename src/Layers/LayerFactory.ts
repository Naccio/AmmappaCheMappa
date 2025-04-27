/// <reference path="LayerAbstractFactory.ts" />
/// <reference path="LayersHelper.ts" />

class LayerFactory {

    public constructor(private factories: LayerAbstractFactory[]) {
    }

    public create(layer: MapLayer): LayerAccessor {
        const factory = this.getFactory(layer.type);

        return {
            data: layer,
            renderer: factory.createRenderer(),
            drawing: factory.createDrawing()
        };
    }

    private getFactory(type: string) {
        const factory = this.factories.find(f => f.type === type);

        if (factory === undefined) {
            throw new Error('Could not find layer factory for type ' + type);
        }

        return factory;
    }
}