import { MapData } from "./MapData";
import { Point } from "./Point";

export interface EditorMap {
    data: MapData,
    zoom: number,
    position: Point,
    activeLayer: string
}