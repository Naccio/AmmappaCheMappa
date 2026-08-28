import { ContentPointType } from "../ContentPointType";
import { ContentPointConstraint } from "./ContentPointConstraint";


export interface ContentPointConfiguration {
    type: ContentPointType;
    connections: number[];
    constraints: ContentPointConstraint[];
}