import { Observable } from "../Events/Observable";
import { MapLayer } from "../Model/MapLayer";
import { LayerRenderer } from "../Rendering/LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";

export class LayerAccessor extends Observable<MapLayer> {
    public constructor(
        data: MapLayer,
        public readonly drawing: DrawingLayer,
        public readonly renderer: LayerRenderer
    ) {
        super(data);
    }

    public get id() {
        return this.value.id;
    }
}