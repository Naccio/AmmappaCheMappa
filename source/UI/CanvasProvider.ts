import { CanvasDrawer } from "../Engine/Rendering/CanvasDrawer";

export class CanvasProvider {
    private readonly canvases: { [id: string]: CanvasDrawer } = {};

    public create(id: string, width: number, height: number, scale?: number) {
        const canvas = document.createElement('canvas'),
            drawer = new CanvasDrawer(canvas);

        scale ??= 1;

        document.getElementById(id)?.remove();

        canvas.id = id;
        canvas.width = width;
        canvas.height = height;

        this.canvases[id] = drawer;

        return drawer;
    }
}