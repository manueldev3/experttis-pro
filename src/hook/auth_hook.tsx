"use client";
import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/config";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { DocumentSnapshot, doc, getDoc, onSnapshot } from "firebase/firestore";

/* --------- class --------- */
import Role from "@/models/role";
import User from "@/models/user";

export default function useAuth() {
    const router = useRouter();
    const pathname = usePathname();

    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (user: AuthUser | null) => {
                setLoadingAuth(true)
                if (user !== null) {
                    onSnapshot(
                        doc(firestore, User.collectionPath, user.uid),
                        async (snapshot: DocumentSnapshot) => {
                            const data: User = snapshot.data() as User;
                            const roles = [];
                            for (const roleReference of snapshot.data()?.roles || []) {
                                const role = (await getDoc(roleReference)).data() as Role;
                                roles.push({
                                    ...role,
                                    reference: roleReference,
                                });
                            }

                            setCurrentUser(new User({
                                ...user,
                                ...data,
                                roles,
                            }));
                        }
                    );
                }

                setTimeout(() => {
                    setLoadingAuth(false);
                }, 1000);
            }
        );

        return () => unsubscribe();
    }, [pathname, router]);

    return {
        loadingAuth,
        currentUser,
    }
}