import { Injectable, inject } from '@angular/core';

import {
    addDoc,
    arrayRemove,
    arrayUnion,

    collection,
    collectionData,
    collectionGroup,
    deleteDoc,
    doc,
    docData,
    DocumentData,
    DocumentReference,
    Firestore,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { merge, Observable } from 'rxjs';

import { FirebaseError } from '@angular/fire/app';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor() { }

    firestore = inject(Firestore)


    addDoc(path: string, data: object): Promise<DocumentReference<object, DocumentData>> {
        const collectionRef = collection(this.firestore, path)
        return addDoc(collectionRef, data)
    }

    collection(path) {
        const collectionRef = collection(this.firestore, path)
        // return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>
        return collectionData(collectionRef, { idField: 'id' }) as Observable<any[]>;

    }

    // sortedCollection(path, orderedBy, direction) {
    //     const collectionRef = collection(this.firestore, path)
    //     const q = query(collectionRef, orderBy(orderedBy, direction))
    //     return collectionData(q, { idField: 'id' })
    // }

    sortedCollection<T>(path: string, field: string, direction: 'asc' | 'desc') {
        const colRef = collection(this.firestore, path);
        const q = query(colRef, orderBy(field, direction));
        return collectionData(q, { idField: 'id' }) as Observable<T[]>;
    }


    sortedCollectionQuery(criteria: any) {
        const collectionRef = collection(this.firestore, criteria.path)
        // const upcomingDatesQuery = collectionRef
        const upcomingOrPastShowsQuery = query(collectionRef, where(
            criteria.queryFieldname,
            criteria.queryOperator,
            criteria.queryCriterium))
        const orderedUpcomingOrPastShowsQuery = query(
            upcomingOrPastShowsQuery,
            orderBy(
                criteria.orderByFieldname,
                criteria.orderDirection
            )
        )
        return collectionData(orderedUpcomingOrPastShowsQuery, { idField: 'id' })
    }

    deleteDoc(path): Promise<void> {
        const docRef = doc(this.firestore, path)
        return deleteDoc(docRef);
    }
    updateDoc(path: string, value): Promise<void> {
        const docRef = doc(this.firestore, path)
        return updateDoc(docRef, value)
    }
    setDoc(path, object): Promise<void> {
        const docRef = doc(this.firestore, path);
        return setDoc(docRef, object)
    }
    getDoc(path): Observable<DocumentData> {
        const docRef = doc(this.firestore, path)
        return docData(docRef, { idField: 'id' })
    }

    async getDocAsync(path): Promise<DocumentData> {
        const docRef = doc(this.firestore, path)
        console.log(docData(docRef))
        return docData(docRef)
    }

    findDoc(path, field, value) {
        const collectionRef = collection(this.firestore, path)
        const queryRef = query(collectionRef, where(field, '==', value))
        return collectionData(queryRef, { idField: 'id' })
    }
    removeElementFromArray(pathToDocument: string, arrayName: string, value: object): Promise<void> {

        const docRef = doc(this.firestore, pathToDocument)
        return updateDoc(docRef, {
            [arrayName]: arrayRemove(value)
        })
    }
    addElementToArray(pathToDocument: string, arrayName: string, value: object): Promise<void> {
        console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return updateDoc(docRef, {
            // spiritsArray: arrayUnion(spirit)
            [arrayName]: arrayUnion(value)
        })
    }
    addElementToArrayF(pathToDocument: string, arrayName: string, value: object): Promise<void> {
        console.log(pathToDocument)
        console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return setDoc(
            docRef,
            {
                [arrayName]: arrayUnion(value)
            },
            {
                merge: true
            },
        )
    }
    updateField(path: string, fieldName: string, newValue: unknown) {
        const docRef = doc(this.firestore, path);
        return updateDoc(docRef, { [fieldName]: newValue })
    }
    findCollectionArray(path, fieldName, value) {
        const collectionRef = collection(this.firestore, path)
        const q = query(collectionRef, where(fieldName, '==', value))
        return collectionData(q, { idField: 'id' })
    }

    // findDoc(path, field, value) {
    //     const collectionRef = collection(this.firestore, path)
    //     const queryRef = query(collectionRef, where(field, '==', value))
    //     return collectionData(queryRef, { idField: 'id' })
    // }

    addFirstSubDoc(userId: string) {
        // Step 1: Reference the parent document
        const userDocRef = doc(this.firestore, 'jazzFry', userId);

        // Step 2: Reference the subcollection under that document
        const ordersCollectionRef = collection(userDocRef, 'orders');

        // Step 3: Add a new document (this will auto-create the subcollection)
        return addDoc(ordersCollectionRef, {
            item: 'Espresso',
            quantity: 1,
            createdAt: new Date()
        });
    }
}
