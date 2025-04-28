type EventHandler<T> = (data: T) => void;

interface ApplicationEvent<T> {
    subscribe(handler: EventHandler<T>): void;
    unsubscribe(handler: EventHandler<T>): void;
}