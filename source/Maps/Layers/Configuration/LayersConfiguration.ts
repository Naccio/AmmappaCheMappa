import { LayerConfiguration } from "./LayerConfiguration";

export class LayersConfiguration {
    public constructor(
        private readonly layers: readonly LayerConfiguration[]
    ) { }

    public get(type: string) {
        const layer = this.layers.find(l => l.type === type);

        if (layer === undefined) {
            throw new Error(`Layer '${type} was not configured.`);
        }

        return layer;
    }
}