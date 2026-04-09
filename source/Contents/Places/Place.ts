import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export interface Place extends MapObject {
    position: Point
}