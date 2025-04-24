interface DrawingLayer {
    render(drawer: Drawer): void;
    setup(container: HTMLElement): void;
    zoom(): void;
}
