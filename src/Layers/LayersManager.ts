/// <reference path="LayerAccessor.ts" />
/// <reference path="LayerFactory.ts" />

class LayersManager {

    private listeners: { (): void; }[] = [];
    public layers: LayerAccessor[] = [];

    public constructor(private factory: LayerFactory) {
    }

    public add(layer: MapLayer) {
        const accessor = this.factory.create(layer);

        this.layers.push(accessor);

        this.listeners.forEach(l => l());

        return accessor;
    }

    public clear() {
        this.layers = [];
    }

    public onChange(handler: () => void) {
        this.listeners.push(handler);
    }
}