import { ObjectGraphicsFactory } from "../Engine/Rendering/ObjectGraphicsFactory";
import { MapObject } from "../Model/MapObject";
import { ContentPoint } from "./ContentPoint";

export interface ContentConfiguration {
    type: string;
    graphics: ObjectGraphicsFactory;
    points: (object: MapObject) => ContentPoint[];
}