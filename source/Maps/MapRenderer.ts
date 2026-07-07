import { MapManager } from "./MapManager";
import { RenderedMap } from "../Engine/Rendering/RenderedMap";
import { VectorMath } from "../Utilities/VectorMath";
import { MapDrawerFactory } from "./MapDrawerFactory";
import { LayersConfiguration } from "./Layers/Configuration/LayersConfiguration";

export class MapRenderer {

    public constructor(
        private readonly drawerFactory: MapDrawerFactory,
        private readonly layers: LayersConfiguration
    ) {
    }

    public render(mapManager: MapManager): RenderedMap {
        const map = mapManager.mapAccessor.map.data,
            layers = map.layers.filter(l => !l.hidden);

        const drawer = this.drawerFactory.create(mapManager.mapAccessor);

        drawer.rectangle(VectorMath.zero, drawer.width, drawer.height, { fillStyle: '#fff' });
        for (let layer of layers) {
            const layerConfiguration = this.layers.get(layer.type),
                renderer = layerConfiguration.renderer.create(layer.id, mapManager);

            renderer.render(drawer);
        }

        return drawer;
    }
}