import { DocumentReference, DocumentSnapshot, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

export interface RelevantExperienceInterface {
  id: string;
  name: string;
  minRate: number;
  maxRate: number;
}

export default class RelevantExperience implements RelevantExperienceInterface {
  id: string;
  name: string;
  minRate: number;
  maxRate: number;

  constructor(data: RelevantExperienceInterface) {
    this.id = data.id;
    this.name = data.name;
    this.minRate = data.minRate;
    this.maxRate = data.maxRate;
  }

  get reference(): DocumentReference {
    return doc(firestore, RelevantExperience.collectionPath, this.id);
  }

  static fromDocument(document: DocumentSnapshot): RelevantExperience {
    return new RelevantExperience({
      ...document.data(),
      id: document.id,
    } as RelevantExperienceInterface);
  }

  static collectionPath = 'relevantExperiences';
}