import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export interface GridText extends MapObject {
    position: Point,
    value: string,
    fontSize: number
}