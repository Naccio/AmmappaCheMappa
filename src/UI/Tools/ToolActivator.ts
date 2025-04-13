/// <reference path='Toolbar.ts' />

class ToolActivator {
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