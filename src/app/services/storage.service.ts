import { Injectable, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
    Storage,
    ref,
    deleteObject,
    listAll,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
    ListResult,
    getBlob,
    UploadResult
} from '@angular/fire/storage';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        private storage: Storage
    ) { }

    async storeFile(path: string, blob: Blob): Promise<string> {
        if (!path || !blob) {
            throw new Error("Can't store object due to insufficient data");
        }

        const storageRef = ref(this.storage, path);

        try {
            await uploadBytesResumable(storageRef, blob);
            return await getDownloadURL(storageRef);
        } catch (err) {
            console.error(`Did not receive downloadUrl: ${(err as FirebaseError).message}`);
            throw err; // rethrow so caller knows it failed
        }
    }

    // async storeFile(path: string, blob: Blob):Promise<string> {
    //     if (path && blob) {
    //         // console.log(path, blob)
    //         const storageRef = ref(this.storage, path);
    //         return uploadBytesResumable(storageRef, blob)
    //             .then((data: any) => {
    //                 // console.log(data)
    //                 return getDownloadURL(storageRef)
    //             })
    //             .catch((err: FirebaseError) => {
    //                 console.log(`did not receive downloadUrl; ${err.message}`)
    //             })

    //     } else {
    //         console.log('can\'t store object due to insufficient data');
    //     }
    // }


    async storeFileAsFile(path: string, file: File): Promise<| UploadResult> {
        const imageUrl = signal<string | null>(null);
        const fileRef = ref(this.storage, path)
        try {
            return await uploadBytes(fileRef, file);
            const downloadUrl = await getDownloadURL(fileRef)
            imageUrl.set(downloadUrl)
        } catch (err) {
            console.log(`upload failed due to: ${err}`)
        }
    }

    deleteObject(path) {
        if (path) {
            const storageRef = ref(this.storage, path)
            return deleteObject(storageRef)
        }
    }
    getBlob(pathToBlob) {
        const storageRef = ref(this.storage, pathToBlob)
        return getBlob(storageRef)
    }
    checkForExistingFilename(path) {
        const storageRef = ref(this.storage, path)
        return getDownloadURL(storageRef)
    }
    getDownloadUrl(path) {
        const storageRef = ref(this.storage, path)
        return getDownloadURL(storageRef)
    }
    async fileExists(path: string): Promise<boolean> {
        const storage = getStorage();
        const fileRef = ref(storage, path);

        try {
            await getMetadata(fileRef);
            return true; // ✅ File exists
        } catch (error: any) {
            // console.log(error)
            if (error.code === 'storage/object-not-found') {
                return false; // ❌ File does not exist
            }
            throw error; // rethrow unexpected errors
        }
    }
}
