/// <reference path="../Model/CellIndex.ts" />
/// <reference path="../UI/UIElement.ts" />

interface DrawingLayer extends UIElement {
    update(cell: CellIndex): void;
    zoom(): void;
}
