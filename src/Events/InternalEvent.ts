/// <reference path="ApplicationEvent.ts" />

class InternalEvent<T> implements ApplicationEvent<T> {
    private handlers: EventHandler<T>[] = [];

    public subscribe(handler: EventHandler<T>): void {
        this.handlers.push(handler);
    }

    public unsubscribe(handler: EventHandler<T>): void {
        this.handlers = this.handlers.filter(item => item !== handler);
    }

    public trigger(data: T): void {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}