/// <reference path="Application.ts" />
/// <reference path="UI/ApplicationUI.ts" />
/// <reference path="UI/Menu/Menu.ts" />
/// <reference path="UI/Menu/SubmenuBuilder.ts" />
/// <reference path="UI/Menu/SubmenuMenuEntry.ts" />
/// <reference path="UI/UIElement.ts" />

class ApplicationBuilder {
    private readonly menu: SubmenuMenuEntry[] = [];
    private readonly ui: UIElement[] = [];

    private startupAction: () => void = () => { };

    public addMenu(label: string, action: (builder: SubmenuBuilder) => void) {
        const builder = new SubmenuBuilder(label);

        action(builder);

        this.menu.push(builder.build());
        return this;
    }

    public addUI(ui: UIElement) {
        this.ui.push(ui);
    }

    public onStartup(action: () => void) {
        this.startupAction = action;
    }

    public build() {
        const mainMenu = new SubmenuMenuEntry('Menu', this.menu, { alwaysVisible: true });
        const menu = new Menu(mainMenu);
        const ui = new ApplicationUI([menu, ...this.ui]);

        ui.build();
        return new Application(this.startupAction);
    }
}