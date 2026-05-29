import { CellIndex } from "../Model/CellIndex";
import { MapObject } from "../Model/MapObject";
import { Point } from "../Model/Point";
import { GridHelper } from "../Utilities/GridHelper";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";

export class MapManager {
    constructor(
        public readonly mapAccessor: MapAccessor,
        public readonly layers: LayersManager
    ) {
    }

    public get id() {
        return this.mapAccessor.id;
    }

    public createObject(type: string, cell: CellIndex, points: Point[], data?: any): MapObject {
        const layer = this.layers.activeLayer;

        if (layer === undefined) {
            throw new Error('No layer selected');
        }

        return {
            type,
            layer: layer.id,
            cell: GridHelper.cellIndexToName(cell),
            points,
            data
        }
    }

    public addObjects(objects: MapObject[]) {
        this.mapAccessor.addObjects(objects);
        objects.forEach(o =>
            //HACK: Potentially upgrading same layer-cell pair more than once
            this.layers.getById(o.layer)?.drawing.update(GridHelper.cellNameToIndex(o.cell))
        );
    }
}