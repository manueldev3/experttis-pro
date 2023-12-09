import { DocumentReference, DocumentSnapshot, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

export interface GradeInterface {
  id: string;
  name: string;
}

export default class Grade implements GradeInterface {
  id: string;
  name: string;

  constructor(data: GradeInterface) {
    this.id = data.id;
    this.name = data.name;
  }

  get reference(): DocumentReference {
    return doc(firestore, Grade.collectionPath, this.id);
  }

  static fromDocument(document: DocumentSnapshot): Grade {
    return new Grade({
      ...document.data(),
      id: document.id,
    } as GradeInterface)
  }

  static collectionPath = "grades";
}