import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export interface River extends MapObject {
    from: Point,
    to: Point,
    bend1: Point,
    bend2: Point
}