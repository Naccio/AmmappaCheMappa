import { MapManager } from "../MapManager";
import { LayerRenderer } from "./LayerRenderer";

export interface LayerRendererFactory {
    create(id: string, map: MapManager): LayerRenderer;
}