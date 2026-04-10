import { CellIndex } from "../Model/CellIndex";
import { UIElement } from "../UI/UIElement";

export interface DrawingLayer extends UIElement {
    update(cell: CellIndex): void;
    zoom(): void;
}
