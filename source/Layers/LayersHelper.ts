/// <reference path="../Model/MapLayer.ts" />
/// <reference path="../Utilities.ts" />

class LayersHelper {
    public static create(type: string, name: string): MapLayer {
        return {
            id: Utilities.generateId('layer'),
            name,
            type
        }
    }
}