import { Drawer } from "./Drawer";

export interface LayerRenderer {
    render(drawer?: Drawer): void;
}