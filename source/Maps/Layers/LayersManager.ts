import { EventHandler } from "../../Engine/Events/ApplicationEvent";
import { InternalEvent } from "../../Engine/Events/InternalEvent";
import { MapAccessor } from "../MapAccessor";
import { MapLayer } from "../../Model/MapLayer";
import { LayerContext } from "./LayerContext";
import { LayerFactory } from "./LayerFactory";
import { InternalObservable } from "../../Engine/Events/InternalObservable";

export class LayersManager {
    private readonly createEvent = new InternalEvent<LayerContext>();
    private readonly deleteEvent = new InternalEvent<LayerContext>();

    private _activeLayer: InternalObservable<LayerContext | undefined>;

    public layers: LayerContext[];

    public constructor(private factory: LayerFactory, private mapAccessor: MapAccessor) {
        const map = mapAccessor.map,
            layers: LayerContext[] = [];

        let selected: LayerContext | undefined = undefined;

        map.data.layers.forEach(l => {
            const layer = factory.create(l.id, mapAccessor);

            if (map.activeLayer === l.id) {
                selected = layer;
            }

            layers.push(layer);
        });

        selected ??= layers[0];

        this.layers = layers;
        this._activeLayer = new InternalObservable<LayerContext | undefined>(selected);

        this._activeLayer.subscribe(l => {
            if (l) {
                this.mapAccessor.map.activeLayer = l.id;
                this.mapAccessor.save();
            }
        });
    }

    public get activeLayer() {
        return this._activeLayer.value;
    }

    public get activeLayerObservable() {
        return this._activeLayer;
    }

    public get mapId() {
        return this.mapAccessor.id;
    }

    public add(layer: MapLayer) {
        this.mapAccessor.addLayer(layer);

        const accessor = this.factory.create(layer.id, this.mapAccessor);

        this.layers.push(accessor);
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
            this.select(this.layers[0].id);
        }
        this.mapAccessor.deleteLayer(id);
        this.deleteEvent.trigger(layer);
    }

    public getById(id: string) {
        return this.layers.find(l => l.id === id);
    }

    public select(id: string) {
        const layer = this.getLayer(id);

        this._activeLayer.value = layer;
    }

    public onSelect(handler: EventHandler<LayerContext>) {
        this._activeLayer.subscribe(layer => {
            if (layer) {
                handler(layer);
            }
        });
    }

    public onCreate(handler: EventHandler<LayerContext>) {
        this.createEvent.subscribe(handler);
    }

    public onDelete(handler: EventHandler<LayerContext>) {
        this.deleteEvent.subscribe(handler);
    }

    private getLayer(id: string) {
        const layer = this.getById(id);

        if (layer === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }

        return layer;
    }
}