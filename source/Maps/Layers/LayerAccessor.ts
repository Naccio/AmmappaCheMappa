import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { MapLayer } from "../../Model/MapLayer";

export class LayerAccessor extends InternalObservable<MapLayer> {
    public constructor(
        data: MapLayer
    ) {
        super(data);
    }

    public get id() {
        return this.value.id;
    }
}