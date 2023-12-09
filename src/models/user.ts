"use client";
import { DocumentReference, Timestamp, doc } from "firebase/firestore";
import Role from "./role";
import { collections } from "@/utils/collections";
import { firestore } from "@/firebase/config";

/* ------ Class ------ */
import Profession from "./profession";
import Language from "./language";
import Skill from "./skill";

export type StatusType = "Active" | "In Review" | "Inactive";

export interface UserInterface {
    uid: string;
    avatar?: string;
    displayName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    emailVerified?: boolean;
    phoneCode: string;
    phone: string;
    alternatePhoneCode?: string;
    alternatePhone?: string;
    roles?: Role[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    reviewAt?: Timestamp;
    status: StatusType;
}

export interface PersonalInfoInterface {
    timezone: string;
    alternateEmail: string;
    street: string;
    appartment: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface ProfessionalInfoInterface {
    disciplinesRefs: DocumentReference[];
    knowledgeAndExperience: string;
    expertiseSummary: string;
    relevantExperienceRef: DocumentReference;
    rate: number;
    professionsRefs: DocumentReference[];
    grades: {
        inTheFieldsOfExpertise: DocumentReference[];
        outTheFieldsOfExpertise: DocumentReference[];
    }
    certificationsRefs: DocumentReference[];
    languages: Language[];
    relevantPositionsRefs: DocumentReference[];
    internationalExperience: {
        name: string;
        abbreviation: string;
    }[];
    authorizedToWorkIn: {
        name: string;
        abbreviation: string;
    }[];
    conferences: Skill[];
    awards: Skill[];
    resumeURL: string;
}

export interface FinancialInfoInterface {
    useHomeAddress: boolean;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    street?: string;
    appartment?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    paypalAccount?: string;
}

export interface ScheduleInterface {
    sunday: number[];
    monday: number[];
    tuesday: number[];
    wednesday: number[];
    thursday: number[];
    friday: number[];
    saturday: number[];
    acceptedJobInterviews: boolean;
    holidays: Timestamp[];
}

export default class User {
    uid: string;
    avatar?: string;
    displayName: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    emailVerified?: boolean;
    phoneCode: string;
    phone: string;
    alternatePhoneCode?: string;
    alternatePhone?: string;
    roles?: Role[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    reviewAt?: Timestamp;
    status: StatusType;
    personalInfo?: PersonalInfoInterface;
    professionalInfo?: ProfessionalInfoInterface;
    financialInfo?: FinancialInfoInterface;
    schedule?: ScheduleInterface;

    constructor(data: {
        uid: string;
        avatar?: string;
        displayName: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        email: string;
        emailVerified?: boolean;
        phoneCode: string;
        phone: string;
        alternatePhoneCode?: string;
        alternatePhone?: string;
        roles?: Role[];
        createdAt: Timestamp;
        updatedAt: Timestamp;
        reviewAt?: Timestamp;
        status: StatusType;
        personalInfo?: PersonalInfoInterface;
        professionalInfo?: ProfessionalInfoInterface;
        financialInfo?: FinancialInfoInterface;
        schedule?: ScheduleInterface;
    }) {
        this.avatar = data.avatar;
        this.displayName = data.displayName;
        this.firstName = data.firstName;
        this.middleName = data.middleName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.emailVerified = data.emailVerified;
        this.phoneCode = data.phoneCode;
        this.phone = data.phone;
        this.alternatePhoneCode = data.alternatePhoneCode;
        this.alternatePhone = data.alternatePhone;
        this.roles = data.roles;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.uid = data.uid;
        this.status = data.status;
        this.reviewAt = data.reviewAt;
        this.personalInfo = data.personalInfo;
        this.professionalInfo = data.professionalInfo;
        this.financialInfo = data.financialInfo;
        this.schedule = data.schedule;
    }

    get reference(): DocumentReference | null {
        return doc(firestore, User.collectionPath, this.uid);
    }

    static collectionPath = collections.users;

    toJson() {
        return {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            phone: this.phone,
            alternatePhone: this.alternatePhone,
            roles: this.roles,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.status,
        }
    }
}