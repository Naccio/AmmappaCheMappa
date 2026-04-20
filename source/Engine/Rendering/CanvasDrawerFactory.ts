import { CanvasDrawer } from "./CanvasDrawer";
import { DrawerFactory } from "./DrawerFactory";

export class CanvasDrawerFactory implements DrawerFactory {
    public create(id: string, width: number, height: number, scale?: number) {
        const canvas = document.createElement('canvas'),
            drawer = new CanvasDrawer(canvas, scale ?? 1);

        document.getElementById(id)?.remove();

        canvas.id = id;
        canvas.width = width;
        canvas.height = height;

        return drawer;
    }
}