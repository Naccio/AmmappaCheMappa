import { MapObject } from "../../Model/MapObject";
import { Graphics } from "./Graphics";

export interface ObjectGraphicsFactory {
    create(object: MapObject): Graphics;
}