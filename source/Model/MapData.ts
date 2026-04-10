import { MapLayer } from "./MapLayer";
import { MapObject } from "./MapObject";

export interface MapData {
    id: string,
    title?: string,
    columns: number,
    rows: number,
    pixelsPerCell: number,
    objects: { [index: string]: MapObject[] },
    layers: MapLayer[]
}