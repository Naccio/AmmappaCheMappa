/// <reference path="../Events/EventManager.ts" />
/// <reference path="LayerAccessor.ts" />
/// <reference path="LayerFactory.ts" />

class LayersManager {
    private readonly newLayerEvent = new InternalEvent<LayerAccessor>();
    private readonly layerSelectedEvent = new InternalEvent<LayerAccessor>();
    private readonly cellUpdateEvent = new InternalEvent<CellIndex>();

    private _activeLayer?: LayerAccessor;

    public layers: LayerAccessor[] = [];

    public constructor(private factory: LayerFactory, private mapAccessor: MapAccessor) {
    }

    public get activeLayer() {
        return this._activeLayer;
    }

    public add(layer: MapLayer) {
        const accessor = this.factory.create(layer);

        this.layers.push(accessor);
        this.newLayerEvent.trigger(accessor);

        if (this._activeLayer === undefined) {
            this.select(layer.id);
        }

        return accessor;
    }

    public clear() {
        this.layers = [];
    }

    public select(id: string) {
        const layer = this.getLayer(id);

        this._activeLayer = layer;

        this.layerSelectedEvent.trigger(layer);
    }

    public setObjects(index: CellIndex, objects: MapObject[]) {
        if (this._activeLayer === undefined) {
            return;
        }

        objects.forEach(o => o.layer = this._activeLayer!.data.id);

        this.mapAccessor.setObjects(index, objects);

        this.cellUpdateEvent.trigger(index);
    }

    public update(id: string, action: (layer: MapLayer) => void) {
        const layer = this.getLayer(id);

        action(layer.data);
        this.mapAccessor.save();
    }

    public onCellUpdate(handler: EventHandler<CellIndex>) {
        this.cellUpdateEvent.subscribe(handler);
    }

    public onLayerSelected(handler: EventHandler<LayerAccessor>) {
        this.layerSelectedEvent.subscribe(handler);
    }

    public onNewLayer(handler: EventHandler<LayerAccessor>) {
        this.newLayerEvent.subscribe(handler);
    }

    private getLayer(id: string) {
        const layer = this.layers.find(l => l.data.id === id);

        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }

        return layer;
    }
}