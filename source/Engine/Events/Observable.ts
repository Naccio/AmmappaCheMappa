import { InternalEvent } from "./InternalEvent";

export class Observable<T> {
    private readonly event = new InternalEvent<T>();

    private _value: T;

    public constructor(value: T) {
        this._value = value;
    }

    public get value() {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
        this.trigger();
    }

    public subscribe(action: (value: T) => void) {
        action(this._value);
        this.event.subscribe(action);
    }

    public update(action: (value: T) => void) {
        action(this._value);
        this.trigger();
    }

    private trigger() {
        this.event.trigger(this._value);
    }
}