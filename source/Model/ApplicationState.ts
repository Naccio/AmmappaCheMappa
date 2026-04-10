import { EditorMap } from "./EditorMap";

export interface ApplicationState {
    maps: EditorMap[];
    activeMap?: string;
    locale?: string;
}