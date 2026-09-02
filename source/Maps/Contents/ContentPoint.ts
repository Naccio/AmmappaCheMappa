import { Point } from "../../Model/Point";
import { ContentPointConstraint } from "./Configuration/ContentPointConstraint";
import { ContentPointEffect } from "./Configuration/ContentPointEffect";
import { ContentPointType } from "./ContentPointType";

export interface ContentPoint {
    type: ContentPointType,
    point: Point,
    connections: number[],
    constraints: ContentPointConstraint[],
    effects: ContentPointEffect[]
}