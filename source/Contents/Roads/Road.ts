import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";

export interface Road extends MapObject {
    from: Point,
    to: Point
}