import { LayerConfiguration } from "./LayerConfiguration";
import { LayerDrawingFactory } from "./LayerDrawingFactory";
import { LayerRendererFactory } from "./LayerRendererFactory";

export class LayerConfigurationBuilder {
    private renderer?: LayerRendererFactory;
    private drawing?: LayerDrawingFactory;

    public constructor(private readonly type: string) { }

    public setRenderer(renderer: LayerRendererFactory) {
        this.renderer = renderer;
        return this;
    }

    public setDrawing(drawing: LayerDrawingFactory) {
        this.drawing = drawing;
        return this;
    }

    public build(): LayerConfiguration {
        if (this.renderer === undefined) {
            throw new Error(`Renderer for layer type '${this.type}' was not assigned.`);
        }

        if (this.drawing === undefined) {
            throw new Error(`Drawing for layer type '${this.type}' was not assigned.`);
        }

        return {
            type: this.type,
            renderer: this.renderer,
            drawing: this.drawing
        };
    }
}