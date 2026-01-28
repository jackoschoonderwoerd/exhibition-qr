import { computed, Injectable, signal } from "@angular/core";
import { Artifact } from "../../../models/artifact.model";

@Injectable({ providedIn: 'root' })
export class ArtifactEditorState {
    // currently edited artifact (null = create mode)
    private _artifact = signal<Artifact | null>(null);

    // derived state
    artifact = computed(() => this._artifact());
    editMode = computed(() => !!this._artifact());

    // actions
    startCreate() {
        this._artifact.set(null);
    }

    startEdit(artifact: Artifact) {
        this._artifact.set(artifact);
    }

    clear() {
        this._artifact.set(null);
    }
}
