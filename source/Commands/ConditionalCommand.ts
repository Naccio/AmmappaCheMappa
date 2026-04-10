import { EventHandler } from "../Events/ApplicationEvent";
import { InternalEvent } from "../Events/InternalEvent";
import { Command } from "./Command";

export abstract class ConditionalCommand implements Command {
    private readonly changeEvent = new InternalEvent<boolean>();
    private readonly _label: string;

    private _disabled: boolean = true;

    constructor(label: string) {
        this._label = label;
    }

    protected set disabled(disabled: boolean) {
        this._disabled = disabled;
        this.changeEvent.trigger(disabled);
    }

    public get disabled() {
        return this._disabled;
    }

    public get label() {
        return this._label;
    }

    abstract execute(): void;

    public onChange(handler: EventHandler<boolean>) {
        this.changeEvent.subscribe(handler);
    };
}