import { Drawer } from "./Drawer";

export interface DrawerFactory {
    create(id: string, width: number, height: number, scale?: number): Drawer;
}