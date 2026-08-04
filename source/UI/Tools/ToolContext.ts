import { CellContext } from "../../Maps/Cells/CellContext";
import { Point } from "../../Model/Point";
import { Vector } from "../../Model/Vector";

export interface ToolContext {
    position: Point,
    direction: Vector,
    cell?: CellContext,
    cellPosition: Point
}