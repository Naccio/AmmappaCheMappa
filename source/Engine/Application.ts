import { ApplicationBuilder } from "./ApplicationBuilder";

export class Application {
    constructor(private startupAction: () => void) {
    }

    public static createBuilder() {
        return new ApplicationBuilder();
    }

    public run() {
        this.startupAction();
    }
}