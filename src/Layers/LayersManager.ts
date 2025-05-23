/// <reference path="../Events/EventManager.ts" />
/// <reference path="LayerAccessor.ts" />
/// <reference path="LayerFactory.ts" />

class LayersManager {
    private readonly createEvent = new InternalEvent<LayerAccessor>();
    private readonly deleteEvent = new InternalEvent<MapLayer>();
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
        const layers = [...this.layers];
        layers.forEach(l => this.delete(l.data.id));
    }

    public delete(id: string) {
        const layer = this.getLayer(id);

        this.layers = this.layers.filter(l => l.data.id !== id);
        if (this.activeLayer?.data.id === id) {
            this._activeLayer = undefined;
        }
        this.deleteEvent.trigger(layer.data);
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

    public onDelete(handler: EventHandler<MapLayer>) {
        this.deleteEvent.subscribe(handler);
    }

    private getLayer(id: string) {
        const layer = this.layers.find(l => l.data.id === id);

        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }

        return layer;
    }
}