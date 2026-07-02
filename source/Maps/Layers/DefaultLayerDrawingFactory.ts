import { CellRenderer } from "../Cells/CellRenderer";
import { MapDrawerFactory } from "../MapDrawerFactory";
import { MapManager } from "../MapManager";
import { DefaultLayerDrawing } from "./DefaultLayerDrawing";
import { LayerDrawingFactory } from "./LayerDrawingFactory";

export class DefaultLayerDrawingFactory implements LayerDrawingFactory {

    public constructor(
        private readonly mapDrawerFactory: MapDrawerFactory,
        private readonly cellRenderer: CellRenderer
    ) { }

    public create(id: string, map: MapManager) {
        const drawer = this.mapDrawerFactory.create(map.mapAccessor);

        return new DefaultLayerDrawing(id, map.cells, drawer, this.cellRenderer);
    }
}