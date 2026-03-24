/// <reference path="Command.ts" />

abstract class SimpleCommand implements Command {
    protected _label: string;

    constructor(label: string) {
        this._label = label;
    }

    public get disabled() {
        return false;
    }

    public get label() {
        return this._label;
    }

    abstract execute(): void;

    public onChange() { };
}