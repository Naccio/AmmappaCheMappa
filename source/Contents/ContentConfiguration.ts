import { ObjectGraphicsFactory } from "../Engine/Rendering/ObjectGraphicsFactory";

export interface ContentConfiguration {
    type: string;
    graphics: ObjectGraphicsFactory;
}