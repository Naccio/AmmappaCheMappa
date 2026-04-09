import { MapObject } from "../../Model/MapObject"
import { Point } from "../../Model/Point"

export interface Tree extends MapObject {
    position: Point,
    crownWidth: number,
    crownHeight: number
    trunkHeight: number
}