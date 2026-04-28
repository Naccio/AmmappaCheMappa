import { ObjectGraphicsFactory } from "../Engine/Rendering/ObjectGraphicsFactory";
import { MapObject } from "../Model/MapObject";
import { ContentPoints } from "./ContentPoints";

export interface ContentConfiguration {
    type: string;
    graphics: ObjectGraphicsFactory;
    points: (object: MapObject) => ContentPoints;
}