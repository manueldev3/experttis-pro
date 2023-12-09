import { useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    setDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { firestore } from '../../firebase/config';
import useAuth from "@/hook/auth_hook";
import { DocumentData } from "firebase-admin/firestore";

import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import FindUser from "./FindUser";
import User from "@/models/user";
import { notification } from "antd";

function Sidebar({
    typeuser
}: {
    typeuser: string
}) {
    const { currentUser } = useAuth();

    const [userName, setUserName] = useState<string | undefined>();
    const [user, setUser] = useState<DocumentData | User | null | undefined>();
    const [err, setErr] = useState(false);

    const handleSearch = async () => {
        const q = query(collection(firestore, 'users'),
            where("lastName", "==", userName));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            })
        } catch (error) {
            setErr(true);
        }
    };

    const initChatWithSelectedUser = async () => {
        if (currentUser && user) {
            const combinedId =
                currentUser.uid > user.uid
                    ? currentUser.uid + user.uid
                    : user.uid + currentUser.uid;
            try {
                if (currentUser.uid != user.uid) {
                    const res = await getDoc(doc(firestore, "chats", combinedId))

                    await setDoc(doc(firestore, "userChats", user.uid), {});
                    await setDoc(doc(firestore, "userChats", currentUser.uid), {});

                    if (!res.exists()) {
                        await setDoc(doc(firestore, 'chats', combinedId), { messages: [] });

                        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
                            [combinedId + ".userInfo"]: {
                                uid: user.uid,
                                firstName: user.firstName,
                                lastName: user.lastName
                            },
                            [combinedId + ".date"]: serverTimestamp(),
                        });

                        await updateDoc(doc(firestore, "userChats", user.uid), {
                            [combinedId + ".userInfo"]: {
                                uid: currentUser.uid,
                                firstName: currentUser.firstName,
                                lastName: currentUser.lastName
                            },
                            [combinedId + ".date"]: serverTimestamp(),
                        });
                    };
                } else {
                    setErr(true)
                    notification.error({
                        message: 'Valid user',
                        description: 'Please, find a valid user',
                        placement: 'bottom',
                    });
                }
            } catch (err) {

            }

            setUser(null);
            setUserName("");
        }
    }

    const handleKey = (e: any) => {
        e.code === 'Enter' && handleSearch()
    }

    return (
        <div className="sidebar">
            <Navbar typeuser={typeuser} />
            <Search
                handleKey={handleKey}
                setUserName={setUserName}
                userName={userName}
            />
            <FindUser
                user={user}
                initChatWithSelectedUser={initChatWithSelectedUser}
            />
            <div className="chats">
                <h3>Chats:</h3>
                <Chats
                    currentUser={currentUser}
                />
            </div >
        </div>
    );
}

export default Sidebar;