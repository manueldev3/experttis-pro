import { DocumentSnapshot, Timestamp, collection } from "firebase/firestore";
import { firestore } from "@/firebase/config";

export type SubscriptionSlugType =
  | "individual"
  | "business"
  | "academic"
  | "academic/institute";
export type SubscriptionType = "single" | "multiple" | "dual";

export interface SubscriptionInterface {
  active: boolean;
  items: string[];
  slug: SubscriptionSlugType;
  type: SubscriptionType;
  subsubscriptions: SubscriptionInterface[];
  // optionals
  id?: string;
  createdAt?: Timestamp;
  imageURL?: string;
  limitUsers?: number;
  price?: number;
  title?: string;
  visiblePrice?: string;
  description?: string;
  updatedAt?: Timestamp;
  customLink?: string;
  stripeID?: string;
}

export default class Subscription implements SubscriptionInterface {
  active: boolean;
  items: string[];
  slug: SubscriptionSlugType;
  type: SubscriptionType;
  subsubscriptions: SubscriptionInterface[];
  // optionals
  id?: string;
  createdAt?: Timestamp;
  imageURL?: string;
  limitUsers?: number;
  price?: number;
  title?: string;
  visiblePrice?: string;
  description?: string;
  updatedAt?: Timestamp;
  customLink?: string;
  stripeID?: string;

  constructor(data: SubscriptionInterface) {
    this.active = data.active;
    this.items = data.items;
    this.slug = data.slug;
    this.type = data.type;
    this.subsubscriptions = data.subsubscriptions;
    // optionals
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.imageURL = data.imageURL;
    this.limitUsers = data.limitUsers;
    this.price = data.price;
    this.title = data.title;
    this.visiblePrice = data.visiblePrice;
    this.description = data.description;
    this.updatedAt = data.updatedAt;
    this.customLink = data.customLink;
    this.stripeID = data.stripeID;
  }

  get className(): string {
    switch (this.type) {
      case "single":
        return "individual";
      case "dual":
        return "business";
      case "multiple":
        return "academic";
    }
  }

  static fromDocumentSnapshot(document: DocumentSnapshot): Subscription {
    return new Subscription({
      id: document.id,
      ...(document.data() as Subscription),
    });
  }

  static toJson(): Object {
    return {
      ...this,
    };
  }

  static collectionPath = "subscriptions";
  static collectionReference = collection(firestore, this.collectionPath);
}
