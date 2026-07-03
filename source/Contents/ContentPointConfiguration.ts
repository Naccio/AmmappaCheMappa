import { ContentPointType } from "./ContentPoint";
import { ContentPointConstraint } from "./ContentPointConstraint";

export interface ContentPointConfiguration {
    type: ContentPointType;
    constraints: ContentPointConstraint[];
}