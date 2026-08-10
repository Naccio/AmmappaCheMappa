import { ContentPointType } from "../ContentPointType";
import { ContentPointConfiguration } from "./ContentPointConfiguration";
import { ApplyToOthersConstraint, ContentPointConstraint, HorizontalConstraint, RangeConstraint, VerticalConstraint } from "./ContentPointConstraint";

export class ContentPointConfigurationBuilder {
    private readonly constraints: ContentPointConstraint[];

    public constructor(public readonly type: ContentPointType) {
        this.constraints = [new RangeConstraint(0, 1)];
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
        this.constraints.push(new ApplyToOthersConstraint(indexes));
        return this;
    }

    public build(): ContentPointConfiguration {
        return {
            type: this.type,
            constraints: this.constraints
        };
    }
}