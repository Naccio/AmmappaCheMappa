import { Drawer } from "./Drawer";

export interface DrawerFactory {
    create(width: number, height: number, scale?: number): Drawer;
}