/// <reference path="Tool.ts" />

class ToolsManager {
    constructor(private _tools: Tool[]) {
    }

    public get tools() {
        return [...this._tools];
    }
}