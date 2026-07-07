export interface Observable<T> {
    get value(): T;

    subscribe(action: (value: T) => void): void;
}