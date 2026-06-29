import { MapLayer } from "../../Model/MapLayer";
import { LayerAccessor } from "./LayerAccessor";

export class LayerFactory {
    public create(layer: MapLayer): LayerAccessor {
        return new LayerAccessor(layer);
    }
}