import { CellContext } from "../../Maps/Cells/CellContext";
import { Point } from "../../Model/Point";

export interface ToolContext {
    mapPosition: Point,
    cell?: CellContext,
    cellPosition: Point
}