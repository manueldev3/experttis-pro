import {
  QueryConstraint,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import Certification, { CertificationInterface } from "@/models/certification";
import { Timestamp } from "firebase-admin/firestore";

// Certification controller
export default class CertificationController {
  static async getCount(): Promise<number> {
    const querySnapshot = await getDocs(
      collection(firestore, Certification.collectionPath)
    );

    return querySnapshot.size;
  }

  static async getAll(
    limited?: number,
    started?: string
  ): Promise<Certification[]> {
    let result: Certification[] = [];
    let queries: QueryConstraint[] = [];

    if (limited) {
      queries.push(limit(limited));
    }

    if (started) {
      queries.push(startAt(started));
    }

    const querySnapshot = await getDocs(
      query(
        collection(firestore, Certification.collectionPath),
        orderBy("name"),
        ...queries
      )
    );

    if (querySnapshot.size > 0) {
      querySnapshot.forEach((item) => {
        result.push(
          new Certification({
            ...(item.data() as CertificationInterface),
            id: item.id,
          })
        );
      });
    }

    return result;
  }

  static async create(certification: Certification) {
    await addDoc(
      collection(firestore, Certification.collectionPath),
      certification.toAddData
    );
  }
}
