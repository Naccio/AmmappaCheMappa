import { Point } from "../Model/Point";
import { ContentPointConstraint } from "./ContentPointConstraint";

export enum ContentPointType {
    position,
    primary,
    helper
}

export interface ContentPoint {
    type: ContentPointType,
    point: Point,
    constraints?: ContentPointConstraint[]
}