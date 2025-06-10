class ModalLauncher {
    private readonly confirmValue = 'confirm';

    public constructor(private localizer: Localizer) {
    }

    public launch(title: string, content: HTMLElement[]) {
        const dialog = document.createElement('dialog'),
            header = document.createElement('header'),
            body = document.createElement('div'),
            footer = document.createElement('footer'),
            h1 = document.createElement('h1'),
            close = document.createElement('button');

        h1.innerText = title;

        close.type = 'button';
        close.innerText = 'x';
        close.tabIndex = -1;
        close.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        header.append(h1);
        header.append(close);

        body.className = 'dialog-body';
        for (let element of content) {
            body.append(element);
        }

        dialog.append(header);
        dialog.append(body);
        dialog.append(footer);

        document.body.append(dialog);

        dialog.showModal();
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
            close = document.createElement('button'),
            cancel = document.createElement('button'),
            confirm = document.createElement('button');

        form.method = 'dialog';

        h1.innerText = title;

        close.type = 'button';
        close.innerText = 'x';
        close.tabIndex = -1;
        close.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

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