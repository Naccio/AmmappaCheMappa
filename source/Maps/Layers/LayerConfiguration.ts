import { LayerDrawingFactory } from "./LayerDrawingFactory";
import { LayerRendererFactory } from "./LayerRendererFactory";

export interface LayerConfiguration {
    readonly type: string;
    readonly renderer: LayerRendererFactory;
    readonly drawing: LayerDrawingFactory;
}