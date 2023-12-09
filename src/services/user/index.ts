/* --------- firebase ---------- */
import { auth, firestore } from "@/firebase/config";
import { UserCredential, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { DocumentSnapshot, collection, doc, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";

/* --------- models ---------- */
import User, { FinancialInfoInterface, PersonalInfoInterface, ProfessionalInfoInterface, ScheduleInterface } from "@/models/user"
import Role from "@/models/role";
import Country from "@/models/country";

export default class UserController {
    static async get(): Promise<User> {
        const user = await getDoc(
            doc(firestore, User.collectionPath, auth.currentUser!.uid),
        );

        return new User({
            ...user.data() as User,
            uid: user.id,
        });
    }

    static async getPhoneCodes(): Promise<Country[]> {
        try {
            const _query = query(
                collection(firestore, "countries"),
            );

            const _countriesDocuments = await getDocs(_query);
            const _phoneCodes: any[] = [];
            _countriesDocuments.forEach((document: DocumentSnapshot) => {
                const data = document.data()!;
                _phoneCodes.push(new Country({
                    ...data as Country,
                    flagURL: data.flag,
                    name: data.name,
                    code: data.phoneCode,
                }));
            });

            return _phoneCodes;
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    static async register(user: User, password: string) {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
            auth,
            user.email,
            password,
        );

        await setDoc(doc(firestore, "userChats", userCredential.user.uid), {});
        console.log('registrando usuario =>')
        await updateProfile(
            auth.currentUser!, {
            displayName: user.displayName,
        }
        )

        await setDoc(
            doc(
                firestore,
                User.collectionPath,
                userCredential.user.uid
            ),
            {
                ...user.toJson(),
                uid: userCredential.user.uid,
                roles: [
                    doc(firestore, Role.collectionPath, "consultant"),
                ]
            },
        );

        await sendEmailVerification(auth.currentUser!);
    }

    static async updatePersonalInfo(user: User, personalInfo: PersonalInfoInterface) {
        await updateDoc(
            user.reference!,
            {
                personalInfo,
            },
        )
    }

    static async updateProfessionalInfo(user: User, professionalInfo: ProfessionalInfoInterface) {
        await updateDoc(
            user.reference!,
            {
                professionalInfo,
            },
        )
    }

    static async updateFinancialInfo(user: User, financialInfo: FinancialInfoInterface) {
        await updateDoc(
            user.reference!,
            {
                financialInfo,
            },
        )
    }

    static async updateSchedule(user: User, schedule: ScheduleInterface) {
        await updateDoc(
            user.reference!,
            {
                schedule,
            },
        );
    }
}