import { Point } from "./Point"

export interface MapObject {
    id: string,
    type: string,
    layer: string,
    cell: string,
    points: Point[],
    data: any
}