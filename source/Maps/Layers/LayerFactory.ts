import { MapAccessor } from "../MapAccessor";
import { LayerAccessor } from "./LayerAccessor";

export class LayerFactory {
    public create(id: string, mapAccessor: MapAccessor): LayerAccessor {
        return new LayerAccessor(id, mapAccessor);
    }
}