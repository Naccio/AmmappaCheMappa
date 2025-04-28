/// <reference path="../Events/EventManager.ts" />
/// <reference path="LayerAccessor.ts" />
/// <reference path="LayerFactory.ts" />

class LayersManager {
    private readonly newLayerEvent = new InternalEvent<LayerAccessor>();
    private readonly cellUpdateEvent = new InternalEvent<CellIndex>();

    public layers: LayerAccessor[] = [];
    public activeLayer?: LayerAccessor;

    public constructor(private factory: LayerFactory, private mapAccessor: MapAccessor) {
    }

    public add(layer: MapLayer) {
        const accessor = this.factory.create(layer);

        if (this.activeLayer === undefined) {
            this.activeLayer = accessor;
        }

        this.layers.push(accessor);
        this.newLayerEvent.trigger(accessor);

        return accessor;
    }

    public clear() {
        this.layers = [];
    }

    public setObjects(index: CellIndex, objects: MapObject[]) {
        if (this.activeLayer === undefined) {
            return;
        }

        objects.forEach(o => o.layer = this.activeLayer!.data.id);

        this.mapAccessor.setObjects(index, objects);

        this.cellUpdateEvent.trigger(index);
    }

    public onCellUpdate(handler: EventHandler<CellIndex>) {
        this.cellUpdateEvent.subscribe(handler);
    }

    public onNewLayer(handler: EventHandler<LayerAccessor>) {
        this.newLayerEvent.subscribe(handler);
    }
}