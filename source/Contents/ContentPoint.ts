import { Point } from "../Model/Point";

export enum ContentPointType {
    position,
    primary,
    helper
}

export interface ContentPoint {
    type: ContentPointType,
    point: Point
}