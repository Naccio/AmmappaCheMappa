import { EventHandler } from "../../Engine/Events/ApplicationEvent";
import { InternalEvent } from "../../Engine/Events/InternalEvent";
import { MapAccessor } from "../MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { MapLayer } from "../../Model/MapLayer";
import { LayerAccessor } from "./LayerAccessor";
import { LayerFactory } from "./LayerFactory";
import { GridHelper } from "../../Utilities/GridHelper";

export class LayersManager {
    private readonly createEvent = new InternalEvent<LayerAccessor>();
    private readonly deleteEvent = new InternalEvent<MapLayer>();
    private readonly selectEvent = new InternalEvent<LayerAccessor>();

    private _activeLayer?: LayerAccessor;

    public layers: LayerAccessor[] = [];

    public constructor(private factory: LayerFactory, private mapAccessor: MapAccessor) {
    }

    public get activeLayer() {
        return this._activeLayer;
    }

    public get mapId() {
        return this.mapAccessor.id;
    }

    public add(layer: MapLayer) {
        const accessor = this.factory.create(layer);

        this.layers.push(accessor);
        this.saveLayers();
        this.createEvent.trigger(accessor);

        return accessor;
    }

    public delete(id: string) {
        if (this.layers.length === 1) {
            return;
        }

        const layer = this.getLayer(id);

        this.layers = this.layers.filter(l => l.id !== id);
        if (this.activeLayer?.id === id) {
            this._activeLayer = undefined;
            this.select(this.layers[0].id);
        }
        this.saveLayers();
        this.deleteEvent.trigger(layer.value);
    }

    public select(id: string) {
        const layer = this.getLayer(id);

        this._activeLayer = layer;
        this.mapAccessor.map.activeLayer = id;

        this.mapAccessor.save();
        this.selectEvent.trigger(layer);
    }

    public setObjects<T>(type: string, index: CellIndex, objects: T[]) {
        if (this._activeLayer === undefined) {
            return;
        }

        const mapObjects = objects.map(o => {
            return {
                type,
                layer: this._activeLayer!.id,
                cell: GridHelper.cellIndexToName(index),
                data: o
            }
        });

        this.mapAccessor.setObjects(index, mapObjects);
        //this._activeLayer.drawing.update(index);
        //HACK: Temporarily updating all layers because of one-item-per-cell rule
        this.layers.forEach(l => l.drawing.update(index));
    }

    public update(id: string, action: (layer: MapLayer) => void) {
        const layer = this.getLayer(id);

        layer.update(action);
        this.mapAccessor.save();
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
        const layer = this.layers.find(l => l.id === id);

        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }

        return layer;
    }

    private saveLayers() {
        this.mapAccessor.map.data.layers = this.layers.map(l => l.value);
        this.mapAccessor.save();
    }
}