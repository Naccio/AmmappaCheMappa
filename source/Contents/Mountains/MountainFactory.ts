import { GridHelper } from "../../Utilities/GridHelper";
import { MathHelper } from "../../Utilities/MathHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { Mountain } from "./Mountain";

export class MountainFactory {
    public create(): Mountain;
    public create(quadrant: number): Mountain;
    public create(quadrant?: number): Mountain {
        const M = MathHelper,
            scale = quadrant === undefined ? 1 : .5,
            width = M.round(M.random(.8, .9) * scale, 2),
            height = M.round(M.random(.5, .8) * scale, 2),
            x = M.random(.4, .6) * scale,
            y = M.random(.8, 1) * scale,
            position = VectorMath
                .startOperation(GridHelper.quadrantShift[quadrant ?? 0])
                .multiply(scale)
                .add({ x, y })
                .round(2);

        return {
            position,
            width,
            height
        }
    }
}