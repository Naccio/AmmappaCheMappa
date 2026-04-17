import { MapObject } from "../../Model/MapObject";
import { Graphics } from "./Graphics";

export interface ObjectGraphicsFactory {
    get type(): string;
    create(object: MapObject): Graphics;
}