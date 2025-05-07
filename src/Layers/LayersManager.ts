/// <reference path="../Events/EventManager.ts" />
/// <reference path="LayerAccessor.ts" />
/// <reference path="LayerFactory.ts" />

class LayersManager {
    private readonly createEvent = new InternalEvent<LayerAccessor>();
    private readonly selectEvent = new InternalEvent<LayerAccessor>();
    private readonly updateEvent = new InternalEvent<CellIndex | MapLayer>();

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
        this.createEvent.trigger(accessor);

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

        this.selectEvent.trigger(layer);
    }

    public setObjects(index: CellIndex, objects: MapObject[]) {
        if (this._activeLayer === undefined) {
            return;
        }

        objects.forEach(o => o.layer = this._activeLayer!.data.id);

        this.mapAccessor.setObjects(index, objects);

        this.updateEvent.trigger(index);
    }

    public update(id: string, action: (layer: MapLayer) => void) {
        const layer = this.getLayer(id);

        action(layer.data);
        this.mapAccessor.save();
        this.updateEvent.trigger(layer.data);
    }

    public onUpdate(handler: EventHandler<CellIndex | MapLayer>) {
        this.updateEvent.subscribe(handler);
    }

    public onSelect(handler: EventHandler<LayerAccessor>) {
        this.selectEvent.subscribe(handler);
    }

    public onCreate(handler: EventHandler<LayerAccessor>) {
        this.createEvent.subscribe(handler);
    }

    private getLayer(id: string) {
        const layer = this.layers.find(l => l.data.id === id);

        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }

        return layer;
    }
}