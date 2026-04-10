import { Vector } from "../../Model/Vector";
import { Toolbar } from "./Toolbar";

export class ToolActivator {
    //TODO: Should not depend on UI element
    constructor(private toolbar: Toolbar) {
    }

    public start(position: Vector) {
        this.toolbar.activeTool?.start(position);
    }

    public move(position?: Vector) {
        this.toolbar.activeTool?.move(position);
    }

    public stop(position?: Vector) {
        this.toolbar.activeTool?.stop(position);
    }
}