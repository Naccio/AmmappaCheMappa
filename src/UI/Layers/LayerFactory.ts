class LayerFactory {

    public constructor(private factories: LayerAbstractFactory[]) {
    }

    public create(type: string) {
        const factory = this.factories.find(f => f.type === type);

        if (factory === undefined) {
            throw new Error('Could not find layer factory for type ' + type);
        }

        return factory.create();
    }
}