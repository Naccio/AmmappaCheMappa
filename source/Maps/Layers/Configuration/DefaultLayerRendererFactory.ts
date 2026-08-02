import { CellRenderer } from "../../Cells/CellRenderer";
import { MapManager } from "../../MapManager";
import { DefaultLayerRenderer } from "../DefaultLayerRenderer";
import { LayerRendererFactory } from "./LayerRendererFactory";


export class DefaultLayerRendererFactory implements LayerRendererFactory {
    public constructor(private readonly cellRenderer: CellRenderer) { }

    public create(id: string, map: MapManager) {
        return new DefaultLayerRenderer(id, map.cells.flat(1), this.cellRenderer);
    }
}