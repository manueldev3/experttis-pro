import Grade from "@/models/grade";

import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/config";

export default class GradeController {
  static async index() {
    const querySnapshot = await getDocs(
      collection(firestore, Grade.collectionPath)
    )

    return querySnapshot.docs.map(doc => Grade.fromDocument(doc))
  }
}