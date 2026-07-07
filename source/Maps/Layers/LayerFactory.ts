import { MapAccessor } from "../MapAccessor";
import { LayerContext } from "./LayerContext";

export class LayerFactory {
    public create(id: string, mapAccessor: MapAccessor): LayerContext {
        return new LayerContext(id, mapAccessor);
    }
}