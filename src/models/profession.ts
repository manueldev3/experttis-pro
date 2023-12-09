import { DocumentReference, Timestamp, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import User from "./user";

export interface ProfessionInterface {
    id: string;
    default: boolean;
    name: string;
    userID: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Discipline
export default class Profession {
    id: string;
    default: boolean;
    name: string;
    userID: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;

    constructor(data: ProfessionInterface) {
        this.id = data.id;
        this.default = data.default;
        this.name = data.name;
        this.userID = data.userID;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    get reference(): DocumentReference {
        return doc(firestore, Profession.collectionPath, this.id);
    }

    get userReference(): DocumentReference {
        return doc(firestore, User.collectionPath, this.userID);
    }

    get toAddData(): Object {
        return {
            default: false,
            name: this.name,
            userID: this.userID,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }
    }

    static collectionPath = "professions";
}