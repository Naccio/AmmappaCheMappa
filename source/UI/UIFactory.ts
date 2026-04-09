export class UIFactory {
    public createCloseButton(onClick: (e: MouseEvent) => void) {
        const close = document.createElement('button');

        close.type = 'button';
        close.innerText = 'x';
        close.tabIndex = -1;
        close.onclick = (e) => onClick(e);

        return close;
    }
}