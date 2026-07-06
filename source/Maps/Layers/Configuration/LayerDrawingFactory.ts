import { MapManager } from "../../MapManager";
import { DrawingLayer } from "../DrawingLayer";

export interface LayerDrawingFactory {
    create(id: string, map: MapManager): DrawingLayer;
}