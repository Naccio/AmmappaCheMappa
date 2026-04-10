import { LayerRenderer } from "../Rendering/LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";

export interface LayerAbstractFactory {
    get type(): string;
    createRenderer(id: string): LayerRenderer;
    createDrawing(id: string): DrawingLayer;
}