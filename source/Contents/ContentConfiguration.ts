import { ObjectGraphicsFactory } from "../Engine/Rendering/ObjectGraphicsFactory";
import { ContentPointsConfiguration } from "./ContentPointsConfiguration";

export interface ContentConfiguration {
    type: string;
    graphics: ObjectGraphicsFactory;
    points: ContentPointsConfiguration;
}