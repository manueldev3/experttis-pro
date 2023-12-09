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
import Profession, { ProfessionInterface } from "@/models/profession";

// Profession controller
export default class ProfessionController {
  static async getCount(): Promise<number> {
    const querySnapshot = await getDocs(
      collection(firestore, Profession.collectionPath)
    );

    return querySnapshot.size;
  }

  static async getAll(
    limited?: number,
    started?: string
  ): Promise<Profession[]> {
    let result: Profession[] = [];
    let queries: QueryConstraint[] = [];

    if (limited) {
      queries.push(limit(limited));
    }

    if (started) {
      queries.push(startAt(started));
    }

    const querySnapshot = await getDocs(
      query(
        collection(firestore, Profession.collectionPath),
        orderBy("name"),
        ...queries
      )
    );

    if (querySnapshot.size > 0) {
      querySnapshot.forEach((item) => {
        result.push(
          new Profession({
            ...(item.data() as ProfessionInterface),
            id: item.id,
          })
        );
      });
    }

    return result;
  }

  static async create(profession: Profession) {
    await addDoc(
      collection(firestore, Profession.collectionPath),
      profession.toAddData
    );
  }
}
