import { Point } from "../../Model/Point";
import { ContentPointConstraint } from "./Configuration/ContentPointConstraint";
import { ContentPointType } from "./ContentPointType";

export interface ContentPoint {
    type: ContentPointType,
    point: Point,
    connections: number[],
    constraints?: ContentPointConstraint[]
}