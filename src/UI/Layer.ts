interface Layer {
    render(drawer: CanvasDrawer): void;
    setup(container: HTMLElement): void;
    zoom(): void;
}
