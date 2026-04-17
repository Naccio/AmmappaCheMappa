import { Drawer } from "./Drawer";

export interface Graphics {
    render(drawer: Drawer): void;
}