import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { Observable } from "../../Engine/Events/Observable";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { Utilities } from "../../Utilities/Utilities";
import { VectorMath } from "../../Utilities/VectorMath";
import { MapAccessor } from "../MapAccessor";

export class CellContext {
    private readonly _objects: InternalObservable<MapObject[]>;

    private _neighbors?: readonly (CellContext | undefined)[];

    public readonly name: string;

    public constructor(
        public readonly index: CellIndex,
        private readonly map: MapAccessor
    ) {
        this.name = GridHelper.cellIndexToName(index);
        this._objects = new InternalObservable<MapObject[]>(this.loadObjects());
    }

    public get neighbors() {
        if (this._neighbors === undefined) {
            throw new Error('Cell neighbors were not assigned.');
        }

        return this._neighbors;
    }

    public set neighbors(value: readonly (CellContext | undefined)[]) {
        if (value.length !== 4) {
            throw new Error('Cell neighbors array length must be 4.');
        }

        this._neighbors = value;
    }

    public get topNeighbor() {
        return this.neighbors[GridHelper.topSideIndex];
    }

    public get rightNeighbor() {
        return this.neighbors[GridHelper.rightSideIndex];
    }

    public get bottomNeighbor() {
        return this.neighbors[GridHelper.bottomSideIndex];
    }

    public get leftNeighbor() {
        return this.neighbors[GridHelper.leftSideIndex];
    }

    public get objects(): Observable<readonly MapObject[]> {
        return this._objects;
    }

    public get pixels() {
        return this.map.map.data.pixelsPerCell;
    }

    public addObjects(newObjects: MapObject[]) {
        this.map.addObjects(newObjects);
        this._objects.value = this.loadObjects();
    }

    public clear() {
        const layer = this.map.map.activeLayer;

        this.map.deleteObjects(o => o.cell === this.name && o.layer === layer);
        this._objects.value = this.loadObjects();
    }

    public createObject(type: string, points: Point[], data?: any): MapObject {
        const cell = this.name,
            layer = this.map.map.activeLayer,
            id = Utilities.generateId(type);

        this.validatePoints(points);

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

    public hasObject(object?: MapObject) {
        if (object === undefined) {
            return false;
        }

        return this._objects.value.some(o => o.id === object.id);
    }

    public update(id: string, points: Point[]) {
        this.validatePoints(points);

        this._objects.update(objects => {
            const object = objects.find(o => o.id === id);

            if (object !== undefined) {
                object.points = points;
            }
        });
        this.map.save();
    }

    private loadObjects() {
        return this.map.map.data.objects.filter(o => o.cell === this.name);
    }

    private validatePoints(points: Point[]) {
        points.forEach(p => VectorMath.checkNormalized(p));
    }
}