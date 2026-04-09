import { MapLayer } from "../Model/MapLayer";
import { Utilities } from "../Utilities";

export class LayersHelper {
    public static create(type: string, name?: string): MapLayer {
        return {
            id: Utilities.generateId('layer'),
            name,
            type
        }
    }
}