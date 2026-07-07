import { DrawerFactory } from "../../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../../MapManager";
import { GridLayer } from "../GridLayer";
import { LayerDrawingFactory } from "./LayerDrawingFactory";


export class GridLayerDrawingFactory implements LayerDrawingFactory {
    public constructor(private readonly drawerFactory: DrawerFactory) {
    }

    create(id: string, map: MapManager) {
        return new GridLayer(id, map.mapAccessor, this.drawerFactory);
    }
}