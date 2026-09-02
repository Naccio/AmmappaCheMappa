import { MapObject } from "../../../Model/MapObject";
import { Vector } from "../../../Model/Vector";
import { ContentPointType } from "../ContentPointType";
import { ContentPointConfiguration } from "./ContentPointConfiguration";
import { BetweenConstraint, ContentPointConstraint, CustomConstraint, DirectionConstraint, RangeConstraint } from "./ContentPointConstraint";
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

    public addConstraint(constraint: ContentPointConstraint) {
        this.constraints.push(constraint);
        return this;
    }

    public addEffect(effect: ContentPointEffect) {
        this.effects.push(effect);
        return this;
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
        return this.addConstraint(new CustomConstraint(action));
    }

    public constrainBetween(index1: number, index2: number) {
        return this.addConstraint(new BetweenConstraint(index1, index2));
    }

    public constrainDirection(angle: number): ContentPointConfigurationBuilder;
    public constrainDirection(direction: Vector): ContentPointConfigurationBuilder;
    public constrainDirection(angleOrDirection: Vector | number) {
        const direction = typeof angleOrDirection === 'number'
            ? { x: Math.cos(angleOrDirection), y: Math.sign(angleOrDirection) }
            : angleOrDirection;

        return this.addConstraint(new DirectionConstraint(direction));
    }

    public constrainVertically() {
        return this.constrainDirection(Math.PI / 2);
    }

    public constrainHorizontally() {
        return this.constrainDirection(0);
    }

    public applyToOthers(indexes?: number[]) {
        return this.addEffect(new ApplyToOthersEffect(indexes));
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