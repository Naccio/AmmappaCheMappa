import { LayerRenderer } from "./LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";
import { MapManager } from "../MapManager";

export interface LayerAbstractFactory {
    get type(): string;
    createRenderer(map: MapManager, id: string): LayerRenderer;
    createDrawing(map: MapManager, id: string): DrawingLayer;
}