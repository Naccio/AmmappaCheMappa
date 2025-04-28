/// <reference path="ApplicationEvent.ts" />
/// <reference path="InternalEvent.ts" />

class EventManager {
    private subscriptions: { [type: string]: any } = {};

    subscribe<T>(type: string, handler: EventHandler<T>) {
        this.getEvent<T>(type).subscribe(handler);
    }

    unsubscribe<T>(type: string, handler: EventHandler<T>) {
        this.getEvent<T>(type).unsubscribe(handler);
    }

    trigger<T>(type: string, data: T) {
        this.getEvent<T>(type).trigger(data);
    }

    private getEvent<T>(type: string) {
        let event = this.subscriptions[type] as InternalEvent<T>;

        if (event === undefined) {
            event = new InternalEvent<T>();
            this.subscriptions[type] = event;
        }

        return event;
    }
}