"use client";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { collections } from "@/utils/collections";

export type RoleType = "consultant" | "subscriptor";

export default class Role {
    reference?: DocumentReference;
    name: string;
    slug: RoleType;
    createdAt: Timestamp;
    updatedAt: Timestamp;

    constructor(data: {
        reference?: DocumentReference,
        name: string,
        slug: RoleType,
        createdAt: Timestamp;
        updatedAt: Timestamp;
    }) {
        this.reference = data.reference;
        this.name = data.name;
        this.slug = data.slug;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static collectionPath = collections.roles;
}