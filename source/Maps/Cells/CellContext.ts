import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { Observable } from "../../Engine/Events/Observable";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { Utilities } from "../../Utilities/Utilities";
import { MapAccessor } from "../MapAccessor";

export class CellContext {
    private readonly _objects: InternalObservable<MapObject[]>;

    public readonly name: string;

    public constructor(
        public readonly index: CellIndex,
        private readonly map: MapAccessor
    ) {
        const cell = GridHelper.cellIndexToName(index),
            objects = map.map.data.objects.filter(o => o.cell === cell);

        this._objects = new InternalObservable<MapObject[]>(objects);
        this.name = cell;
    }

    public get objects(): Observable<readonly MapObject[]> {
        return this._objects;
    }

    public get pixels() {
        return this.map.map.data.pixelsPerCell;
    }

    public addObjects(newObjects: MapObject[]) {
        this._objects.update(objects => {
            newObjects.forEach(o => objects.push(o));
        });
        this.map.addObjects(newObjects);
    }

    public clear() {
        this._objects.value = [];
        this.map.deleteObjects(o => o.cell === this.name && o.layer === this.map.map.activeLayer);
        this.map.save();
    }

    public createObject(type: string, points: Point[], data?: any): MapObject {
        const cell = this.name,
            layer = this.map.map.activeLayer,
            id = Utilities.generateId(type);

        if (layer === undefined) {
            throw new Error('No layer selected');
        }

        return {
            id,
            type,
            layer,
            cell,
            points,
            data
        }
    }

    public update(id: string, points: Point[]) {
        this._objects.update(objects => {
            const object = objects.find(o => o.id === id);

            if (object !== undefined) {
                object.points = points;
            }
        });
        this.map.save();
    }
}