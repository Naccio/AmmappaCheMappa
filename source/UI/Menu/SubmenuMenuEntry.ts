/// <reference path="./MenuEntry.ts" />

interface SubmenuMenuSettings {
    alwaysVisible?: boolean;
    align?: 'left' | 'right';
}

class SubmenuMenuEntry implements MenuEntry {
    constructor(private label: string, private entries: MenuEntry[], private settings?: SubmenuMenuSettings) {
    }

    public build() : HTMLElement[] {
        const menu = document.createElement('menu'),
            alwaysVisible = this.settings?.alwaysVisible ?? false,
            align = this.settings?.align ?? 'left';

        let result: HTMLElement[] = [menu];

        if (!alwaysVisible) {
            const button = document.createElement('button');

            menu.popover = 'auto';

            button.innerText = this.label;
            button.popoverTargetElement = menu;
            button.popoverTargetAction = 'toggle';

            menu.addEventListener('toggle', (e) => {
                if (!(e instanceof ToggleEvent && e.newState == 'open')) {
                    return;
                }

                const parentBox = menu.parentElement?.getBoundingClientRect();

                menu.style.top = parentBox?.bottom + 'px';

                switch (align) {
                    case 'left':
                        menu.style.left = parentBox?.left + 'px';
                        break;
                    case 'right':
                        const parentRight = parentBox?.right ?? 0,
                            menuRight = window.innerWidth - parentRight;
                        menu.style.right = menuRight + 'px';
                        break;
                }
            })

            result = [button, ...result];
        }

        for (let entry of this.entries) {
            const item = document.createElement('li'),
                builtEntry = entry.build();

            if (Array.isArray(builtEntry)) {
                for (let element of builtEntry) {
                    item.append(element);
                }
            } else {
                item.append(builtEntry);
            }

            menu.append(item);
        }

        return result;
    }
}