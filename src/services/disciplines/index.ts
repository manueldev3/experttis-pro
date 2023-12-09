import { firestore } from "@/firebase/config";

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
import Discipline, { DisciplineInterface } from "@/models/disciplines";

// Discipline controller
export default class DisciplineController {
  static async getCount(): Promise<number> {
    const querySnapshot = await getDocs(
      collection(firestore, Discipline.collectionPath)
    );

    return querySnapshot.size;
  }

  static async getAll(
    limited?: number,
    started?: string
  ): Promise<Discipline[]> {
    let result: Discipline[] = [];
    let queries: QueryConstraint[] = [];

    if (limited) {
      queries.push(limit(limited));
    }

    if (started) {
      queries.push(startAt(started));
    }

    const querySnapshot = await getDocs(
      query(
        collection(firestore, Discipline.collectionPath),
        orderBy("name"),
        ...queries
      )
    );

    if (querySnapshot.size > 0) {
      querySnapshot.forEach((item) => {
        result.push(
          new Discipline({
            ...(item.data() as DisciplineInterface),
            id: item.id,
          })
        );
      });
    }

    return result;
  }

  static async create(discipline: Discipline) {
    await addDoc(
      collection(firestore, Discipline.collectionPath),
      discipline.toAddData
    );
  }
}
