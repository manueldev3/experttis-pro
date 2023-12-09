"use client";
import { DocumentReference, Timestamp } from "firebase/firestore";
import Currency from "./currency";
import { collections } from "@/utils/collections";

export default class Country {
    reference?: DocumentReference;
    code: string;
    currency: Currency;
    flagURL: string;
    name: string;
    phoneCode: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;

    constructor(data: {
        reference?: DocumentReference,
        code: string,
        currency: Currency;
        flagURL: string;
        name: string;
        phoneCode: string;
        createdAt: Timestamp;
        updatedAt: Timestamp;
    }) {
        this.reference = data.reference;
        this.code = data.code;
        this.currency = data.currency;
        this.flagURL = data.flagURL;
        this.name = data.name;
        this.phoneCode = data.phoneCode;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static collectionPath = collections.countries;
}