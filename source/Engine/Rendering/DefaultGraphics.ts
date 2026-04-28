import { Drawer } from "./Drawer";
import { Graphics } from "./Graphics";

export class DefaultGraphics implements Graphics {
    private static _instance: DefaultGraphics;

    private constructor() {}

    public render(drawer: Drawer) {
        drawer.text({ x: .5, y: .5 }, '?', .5);
    }

    public static get instance() {
        DefaultGraphics._instance ??= new DefaultGraphics;

        return DefaultGraphics._instance;
    }
}