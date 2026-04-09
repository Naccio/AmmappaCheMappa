import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export interface Mountain extends MapObject {
    position: Point,
    width: number,
    height: number
}