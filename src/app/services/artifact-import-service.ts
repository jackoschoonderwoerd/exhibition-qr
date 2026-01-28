import { Injectable } from '@angular/core';
import { Firestore, collection, writeBatch, doc } from '@angular/fire/firestore';
import { Artifact } from '../../models/artifact.model';


@Injectable({ providedIn: 'root' })
export class ArtifactImportService {
    constructor(private firestore: Firestore) { }

    /**
     * Batch import an array of artifacts to Firestore
     * Each document will get an auto-generated ID
     */
    async importArtifacts(artifacts: Artifact[]) {
        if (!artifacts.length) return;

        const batch = writeBatch(this.firestore);
        const colRef = collection(this.firestore, 'artifacts');

        artifacts.forEach(artifact => {
            const docRef = doc(colRef); // auto-ID
            batch.set(docRef, artifact);
        });

        try {
            await batch.commit();
            console.log(`✅ Imported ${artifacts.length} artifacts successfully.`);
        } catch (err) {
            console.error('❌ Error importing artifacts:', err);
        }
    }
}
