import { useContext, useEffect, useState } from "react";
import { ChatContext } from '@/context/chatContext';
import { individualMessageInterface } from "@/interfaces/chat";
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import useAuth from "@/hook/auth_hook";

import FMessage from "./Fmessage";
import { firestore } from "@/firebase/config";

function Fmesssages() {
    const { currentUser } = useAuth();
    const [messagesState, setMessagesState] = useState<DocumentData | string[]>();

    const contextChat = useContext(ChatContext)
    const data = contextChat?.data

    useEffect(() => {
        if (data) {
            const unsub = onSnapshot(doc(firestore, 'chats', data.chatId), (doc) => {
                doc.exists() && setMessagesState(doc.data().messages)
            })

            return () => {
                unsub()
            }
        }
    }, [data])

    return (
        <div className="fmessages">
            {
                data && data.user.uid.length > 2 &&
                messagesState?.map((message: individualMessageInterface) => {
                    const currentId = currentUser?.uid
                    const senderId = message.senderId
                    return (
                        currentId === senderId ?
                            <FMessage
                                key={message.id}
                                typeUser={'sender'}
                                thisMessage={message}
                            /> :
                            <FMessage
                                key={message.id}
                                typeUser={'addressee'}
                                thisMessage={message}
                            />

                    )
                })
            }
        </div>
    );
}

export default Fmesssages;