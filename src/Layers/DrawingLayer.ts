interface DrawingLayer {
    setup(container: HTMLElement): void;
    update(cell: CellIndex): void;
    zoom(): void;
}
