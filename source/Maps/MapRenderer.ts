import { MapManager } from "./MapManager";
import { RenderedMap } from "../Engine/Rendering/RenderedMap";
import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";
import { VectorMath } from "../Utilities/VectorMath";

export class MapRenderer {

    public constructor(private readonly drawerFactory: DrawerFactory) {
    }

    render(mapManager: MapManager): RenderedMap {

        const map = mapManager.mapAccessor.map.data,
            layers = mapManager.layers.layers.filter(l => !l.value.hidden),
            width = map.columns * map.pixelsPerCell,
            height = map.rows * map.pixelsPerCell;

        const drawer = this.drawerFactory.create(map.id, width, height);

        drawer.rectangle(VectorMath.zero, width, height, { fillStyle: '#fff' });
        for (let layer of layers) {
            layer.renderer.render(drawer);
        }

        return drawer;
    }
}