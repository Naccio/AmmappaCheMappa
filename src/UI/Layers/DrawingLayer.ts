interface DrawingLayer {
    render(drawer: CanvasDrawer): void;
    setup(container: HTMLElement): void;
    zoom(): void;
}
