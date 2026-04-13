import { LayersManager } from "../Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";

export class MapManager {
    constructor(public mapAccessor: MapAccessor, public layers: LayersManager) {
    }

    public get id() {
        return this.mapAccessor.id;
    }
}