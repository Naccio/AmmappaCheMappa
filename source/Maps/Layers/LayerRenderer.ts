import { Drawer } from "../../Engine/Rendering/Drawer";

export interface LayerRenderer {
    render(drawer?: Drawer): void;
}