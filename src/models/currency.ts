"use client";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { collections } from "@/utils/collections";

export default class Currency {
    reference?: DocumentReference;
    change: number;
    code: string;
    decimals: number;
    decimalsSeparator: string;
    name: string;
    active: boolean;
    symbol: number;
    thousandsSeparator?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;

    constructor(data: {
        reference?: DocumentReference;
        change: number,
        code: string,
        decimals?: number,
        decimalsSeparator?: string,
        name: string,
        active?: boolean,
        symbol: number,
        thousandsSeparator?: string,
        createdAt: Timestamp;
        updatedAt: Timestamp;
    }) {
        this.reference;
        this.change = data.change;
        this.code = data.code;
        this.decimals = data.decimals || 2;
        this.decimalsSeparator = data.decimalsSeparator || ".";
        this.name = data.name;
        this.active = data.active || true;
        this.symbol = data.symbol;
        this.thousandsSeparator || ",";
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static collectionPath = collections.currencies;
}