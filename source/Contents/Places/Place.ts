import { Point } from "../../Model/Point";

export interface Place {
    position: Point
}

export function isPlace(object: any): object is Place {
    return 'position' in object;
}