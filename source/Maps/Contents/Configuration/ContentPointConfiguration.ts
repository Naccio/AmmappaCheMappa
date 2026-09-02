import { ContentPointType } from "../ContentPointType";
import { ContentPointConstraint } from "./ContentPointConstraint";
import { ContentPointEffect } from "./ContentPointEffect";


export interface ContentPointConfiguration {
    type: ContentPointType;
    connections: number[];
    constraints: ContentPointConstraint[];
    effects: ContentPointEffect[];
}