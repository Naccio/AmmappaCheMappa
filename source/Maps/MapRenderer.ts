import { MapManager } from "./MapManager";
import { RenderedMap } from "../Engine/Rendering/RenderedMap";
import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";
import { VectorMath } from "../Utilities/VectorMath";
import { LayerUIFactory } from "./Layers/LayerUIFactory";

export class MapRenderer {

    public constructor(
        private readonly drawerFactory: DrawerFactory,
        private readonly layerUI: LayerUIFactory
    ) {
    }

    render(mapManager: MapManager): RenderedMap {
        const map = mapManager.mapAccessor.map.data,
            layers = map.layers.filter(l => !l.hidden),
            width = map.columns * map.pixelsPerCell,
            height = map.rows * map.pixelsPerCell;

        const drawer = this.drawerFactory.create(map.id, width, height);

        drawer.rectangle(VectorMath.zero, width, height, { fillStyle: '#fff' });
        for (let layer of layers) {
            const renderer = this.layerUI.createRenderer(mapManager, layer);
            renderer.render(drawer);
        }

        return drawer;
    }
}