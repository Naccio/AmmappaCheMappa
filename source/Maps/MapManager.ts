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

    public clear(cellIndex: CellIndex) {
        const cell = GridHelper.cellIndexToName(cellIndex),
            layer = this.layers.activeLayer?.id;

        if (layer === undefined) {
            throw new Error('No layer selected');
        }

        this.mapAccessor.deleteObjects(o => o.cell === cell && o.layer === layer);
        this.layers.getById(layer)?.drawing.update(cellIndex);
    }

    public createObject(type: string, cellIndex: CellIndex, points: Point[], data?: any): MapObject {
        const cell = GridHelper.cellIndexToName(cellIndex),
            layer = this.layers.activeLayer?.id;

        if (layer === undefined) {
            throw new Error('No layer selected');
        }

        return {
            type,
            layer,
            cell,
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