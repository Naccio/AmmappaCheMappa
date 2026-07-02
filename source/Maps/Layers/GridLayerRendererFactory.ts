import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../MapManager";
import { GridLayer } from "./GridLayer";
import { LayerRendererFactory } from "./LayerRendererFactory";

export class GridLayerRendererFactory implements LayerRendererFactory {
    public constructor(private readonly drawerFactory: DrawerFactory) {
    }

    create(id: string, map: MapManager) {
        return new GridLayer(id, map.mapAccessor, this.drawerFactory);
    }
}