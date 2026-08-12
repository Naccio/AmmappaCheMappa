import { CellIndex } from "../Model/CellIndex";
import { EditorMap } from "../Model/EditorMap";
import { MapObject } from "../Model/MapObject";
import { Point } from "../Model/Point";
import { Store } from "../Engine/Store";
import { VectorMath } from "../Utilities/VectorMath";
import { MapLayer } from "../Model/MapLayer";

export class MapAccessor {
    constructor(private _map: EditorMap, private store: Store) {
    }

    public get id() {
        return this.map.data.id;
    }

    public get map() {
        return this._map;
    }

    public get scale() {
        return this.map.zoom / this.map.data.pixelsPerCell;
    }

    public getIndex(position?: Point): CellIndex | undefined {
        if (position === undefined) {
            return undefined;
        }

        const map = this.map.data,
            cell = VectorMath.multiply(position, this.scale),
            column = Math.floor(cell.x),
            row = Math.floor(cell.y);

        if (row < 0 || row >= map.rows || column < 0 || column >= map.columns) {
            return undefined;
        }

        return { column, row };
    }

    public getLayer(id: string) {
        return this.map.data.layers.find(l => l.id === id);
    }

    public normalizedPosition(cell: CellIndex, absolutePosition: Point): Point {
        const cellPosition = {
            x: cell.column,
            y: cell.row
        };

        return VectorMath
            .startOperation(absolutePosition)
            .multiply(this.scale)
            .subtract(cellPosition)
            .round(2);
    }

    public save() {
        if (this._map) {
            this.store.saveMap(this._map);
        }
    }

    public addLayer(layer: MapLayer) {
        const map = this.map.data;

        map.layers.push(layer);

        this.save();
    }

    public addObjects(objects: MapObject[]) {
        const map = this.map.data;

        map.objects = [...map.objects, ...objects];

        this.save();
    }

    public deleteLayer(id: string) {
        const map = this.map.data;

        map.layers = map.layers.filter(l => l.id !== id);
        map.objects = map.objects.filter(o => o.layer !== id);

        this.save();
    }

    public deleteObjects(condition: (o: MapObject) => boolean) {
        const map = this.map.data;

        map.objects = map.objects.filter(o => !condition(o));

        this.save();
    }
}