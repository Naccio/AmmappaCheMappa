class Lazy<T> {
    private _value?: T;

    constructor(private factory: () => T) {
    }

    get value() {
        if (this._value === undefined) {
            this._value = this.factory();
        }

        return this._value;
    }
}