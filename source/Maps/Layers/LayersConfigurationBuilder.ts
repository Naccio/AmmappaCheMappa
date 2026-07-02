import { DefaultLayerRenderer } from "./DefaultLayerRenderer";
import { LayerConfiguration } from "./LayerConfiguration";
import { LayerConfigurationBuilder } from "./LayerConfigurationBuilder";
import { LayerDrawingFactory } from "./LayerDrawingFactory";
import { LayerRendererFactory } from "./LayerRendererFactory";
import { LayersConfiguration } from "./LayersConfiguration";

export class LayersConfigurationBuilder {
    private readonly layers: LayerConfiguration[];

    public constructor(
        private readonly defaultRenderer: LayerRendererFactory,
        private readonly defaultDrawing: LayerDrawingFactory
    ) {
        this.layers = [];
    }

    public add(type: string, action?: (b: LayerConfigurationBuilder) => void) {
        if (this.layers.some(l => l.type === type)) {
            throw new Error(`Layer '${type}' was already configured.`);
        }

        const builder = new LayerConfigurationBuilder(type);

        builder
            .setRenderer(this.defaultRenderer)
            .setDrawing(this.defaultDrawing);


        if (action !== undefined) {
            action(builder);
        }

        const configuration = builder.build();

        this.layers.push(configuration);

        return this;
    }

    public build() {
        return new LayersConfiguration(this.layers);
    }
}