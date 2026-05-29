import { Point } from "./Point"

export interface MapObject {
    type: string,
    layer: string,
    cell: string,
    points: Point[],
    data: any
}