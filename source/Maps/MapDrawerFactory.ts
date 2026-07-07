import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";
import { MapAccessor } from "./MapAccessor";

export class MapDrawerFactory {
    constructor(private readonly drawerFactory: DrawerFactory) {
    }

    public create(mapAccessor: MapAccessor, scale?: number) {
        const map = mapAccessor.map.data;

        return this.drawerFactory.create(map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, scale);
    }
}