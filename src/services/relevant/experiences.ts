import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import RelevantExpereince from "@/models/relevantExperience";

// Relevant expereince controller
export default class RelevantExperienceController {
  static async index() {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, RelevantExpereince.collectionPath),
        orderBy("position", "asc")
      )
    );

    return querySnapshot.docs.map((doc) => RelevantExpereince.fromDocument(doc));
  }
}