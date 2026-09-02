import { MapObject } from "../../../Model/MapObject";
import { Vector } from "../../../Model/Vector";
import { ContentPointType } from "../ContentPointType";
import { ContentPointConfiguration } from "./ContentPointConfiguration";
import { ContentPointConstraint, CustomConstraint, HorizontalConstraint, RangeConstraint, VerticalConstraint } from "./ContentPointConstraint";
import { ApplyToOthersEffect, ContentPointEffect } from "./ContentPointEffect";

export class ContentPointConfigurationBuilder {
    private readonly constraints: ContentPointConstraint[];
    private readonly effects: ContentPointEffect[];
    private readonly connections: Set<number>;

    public constructor(public readonly type: ContentPointType) {
        this.constraints = [new RangeConstraint(0, 1)];
        this.effects = [];
        this.connections = new Set<number>();
    }

    public connectedTo(index: number): ContentPointConfigurationBuilder;
    public connectedTo(indexes: number[]): ContentPointConfigurationBuilder;
    public connectedTo(indexOrIndexes: number | number[]) {
        if (typeof indexOrIndexes === 'number') {
            this.connections.add(indexOrIndexes);
        } else {
            indexOrIndexes.forEach(i => this.connections.add(i));
        }
        return this;
    }

    public constrain(action: (object: MapObject, pointIndex: number, change: Vector) => Vector) {
        this.constraints.push(new CustomConstraint(action));
        return this;
    }

    public constrainVertically() {
        this.constraints.push(new VerticalConstraint());
        return this;
    }

    public constrainHorizontally() {
        this.constraints.push(new HorizontalConstraint());
        return this;
    }

    public applyToOthers(indexes?: number[]) {
        this.effects.push(new ApplyToOthersEffect(indexes));
        return this;
    }

    public build(): ContentPointConfiguration {
        return {
            type: this.type,
            connections: [...this.connections],
            constraints: this.constraints,
            effects: this.effects
        };
    }
}