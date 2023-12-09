import { firestore } from "@/firebase/config";
/* import { BusinessTypeInterface } from "@/interfaces/business-type-interfarce"; */
import { DocumentReference, collection, doc } from "firebase/firestore";

// Business Type
export default class BusinessType /* implements BusinessTypeInterface */ {
  id;
  name;
  default;
  createdAt;
  updatedAt;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.default = data.default;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get reference(): DocumentReference {
    return doc(firestore, "businessType", this.id);
  };

  static collection = collection(firestore, "businessType");
}