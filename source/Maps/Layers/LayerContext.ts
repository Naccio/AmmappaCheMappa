import { InternalEvent } from "../../Engine/Events/InternalEvent";
import { MapLayer } from "../../Model/MapLayer";
import { MapAccessor } from "../MapAccessor";

export class LayerContext {
    private readonly updateEvent: InternalEvent<undefined>;
    private readonly data: MapLayer;

    public constructor(
        public readonly id: string,
        private readonly map: MapAccessor
    ) {
        const data = map.getLayer(id);

        if (data === undefined) {
            throw new Error(`Layer '${id}' does not exist.`);
        }
        this.data = data;
        this.updateEvent = new InternalEvent<undefined>();
    }

    public get type() {
        return this.data.type;
    }

    public get name() {
        return this.data.name;
    }

    public set name(value: string | undefined) {
        this.update(d => d.name = value);
    }

    public get hidden() {
        return this.data.hidden ?? false;
    }

    public set hidden(value: boolean) {
        this.update(d => d.hidden = value ? true : undefined);
    }

    public onUpdate(action: () => void) {
        this.updateEvent.subscribe(action);
    }

    private update(action: (data: MapLayer) => void) {
        action(this.data);
        this.updateEvent.trigger(undefined);
        this.map.save();
    }
}