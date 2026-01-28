import { Timestamp } from "rxjs";

export interface Artifact {
    id?: string;
    titleNL: string;
    titleEN?: string;
    visible: boolean
    descriptionNL: string;
    descriptionEN?: string;
}

// imageUrls?: string[]
// year?: number
// location?: string
// createdAt: timestamp
// updatedAt: timestamp
