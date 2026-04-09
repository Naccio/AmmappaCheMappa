import { Localizer } from "../Localization/Localizer";
import { UIFactory } from "./UIFactory";

//TODO: Handle code duplication on dialog creation
export class ModalLauncher {
    private readonly confirmValue = 'confirm';

    public constructor(private uiFactory: UIFactory, private localizer: Localizer) {
    }

    public launch(title: string, content: HTMLElement[]) {
        const dialog = document.createElement('dialog'),
            header = document.createElement('header'),
            body = document.createElement('div'),
            footer = document.createElement('footer'),
            h1 = document.createElement('h1'),
            close = this.uiFactory.createCloseButton(e => {
                e.preventDefault();
                dialog.close();
            });

        h1.innerText = title;

        header.append(h1);
        header.append(close);

        body.className = 'dialog-body';
        for (let element of content) {
            body.append(element);
        }

        dialog.append(header);
        dialog.append(body);
        dialog.append(footer);

        dialog.onclose = () => dialog.remove();

        document.body.append(dialog);

        dialog.showModal();
    }

    public launchConfirm(title: string, message: string, confirmCallback: () => void) {
        const p = document.createElement('p');

        p.innerText = message;

        this.launchForm(title, [p], confirmCallback);
    }

    public launchForm(title: string, content: HTMLElement[], confirmCallback: () => void): void;
    public launchForm(title: string, content: HTMLElement[], confirmCallback: () => void, cancelCallback: () => void): void;
    public launchForm(title: string, content: HTMLElement[], confirmCallback: () => void, cancelCallback?: () => void) {
        const dialog = document.createElement('dialog'),
            header = document.createElement('header'),
            body = document.createElement('div'),
            footer = document.createElement('footer'),
            form = document.createElement('form'),
            h1 = document.createElement('h1'),
            close = this.uiFactory.createCloseButton(e => {
                e.preventDefault();
                dialog.close();
            }),
            cancel = document.createElement('button'),
            confirm = document.createElement('button');

        form.method = 'dialog';

        h1.innerText = title;

        header.append(h1);
        header.append(close);

        body.className = 'dialog-body';
        for (let element of content) {
            body.append(element);
        }

        confirm.innerText = this.localizer['button_label_confirm'];
        confirm.value = this.confirmValue;

        cancel.innerText = this.localizer['button_label_cancel'];
        cancel.formNoValidate = true;

        footer.append(confirm);
        footer.append(cancel);

        form.append(header);
        form.append(body);
        form.append(footer);

        dialog.append(form);

        dialog.onclose = () => {
            if (dialog.returnValue === this.confirmValue) {
                confirmCallback();
            } else if (cancelCallback !== undefined) {
                cancelCallback();
            }
            dialog.remove();
        };

        document.body.append(dialog);

        dialog.showModal();
    }
}