import { Timestamp } from "rxjs";

export interface Artifact {
  id?: string;
  title: string
  description: string
  images: string[]
  year: number
  location: string
  // createdAt: timestamp
  // updatedAt: timestamp
  visible: boolean
}
