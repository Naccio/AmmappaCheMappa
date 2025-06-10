/// <reference path="../../MathHelper.ts" />
/// <reference path="../../VectorMath.ts" />

class  TreesHelper {
    public static readonly objectType = 'tree';

    public static create() : Tree {
        const crownWidth = MathHelper.random(.4, .6),
            height = MathHelper.random(.8, .95),
            crownTrunkRatio = MathHelper.random(.2, .35),
            trunkHeight = height * crownTrunkRatio,
            crownHeight = height * (1 - crownTrunkRatio),
            position = {
                x: MathHelper.random(.35, .65),
                y: MathHelper.random(.8, 1)
            };

        return {
            type: TreesHelper.objectType,
            layer: 'terrain',
            position,
            crownWidth,
            crownHeight,
            trunkHeight
        }
    }

    public static isTree(object: MapObject) : object is Tree {
        return object.type === this.objectType;
    }
}