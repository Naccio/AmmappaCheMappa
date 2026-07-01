import { CanvasDrawer } from "./CanvasDrawer";
import { DrawerFactory } from "./DrawerFactory";

export class CanvasDrawerFactory implements DrawerFactory {
    public create(width: number, height: number, scale?: number) {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        return new CanvasDrawer(canvas, scale ?? 1);
    }
}