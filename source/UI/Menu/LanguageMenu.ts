import { LocalizationHelper } from "../../Localization/LocalizationHelper";
import { Localizer } from "../../Localization/Localizer";
import { ApplicationState } from "../../Model/ApplicationState";
import { LanguageMenuEntry } from "./LanguageMenuEntry";
import { SubmenuMenuEntry } from "./SubmenuMenuEntry";

export class LanguageMenu extends SubmenuMenuEntry {

    public constructor(state: ApplicationState, localizer: Localizer) {
        const entries: LanguageMenuEntry[] = [];

        for (let language of LocalizationHelper.languages) {
            entries.push(new LanguageMenuEntry(state, language));
        }

        super(localizer['menu_label_language'], entries, { align: 'right' });
    }
}