import useAuth from "@/hook/auth_hook";

import { useState, useContext, useEffect } from 'react';
import { ChatContext } from '@/context/chatContext';

import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { individualMessageInterface } from '@/interfaces/chat';

import Message from "./Message";

import imgChat from '@/assets/img/chat_ilustration.png';

function Messsages() {
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
        <div className={data && data.user.uid.length > 2 ? `messages` : 'init'}>
            {
                data && data.user.uid.length > 2 ?
                    messagesState?.map((message: individualMessageInterface) => {
                        const currentId = currentUser?.uid
                        const senderId = message.senderId
                        return (
                            currentId === senderId ?
                                <Message
                                    key={message.id}
                                    typeUser={'sender'}
                                    message={message}
                                /> :
                                <Message
                                    key={message.id}
                                    typeUser={'addressee'}
                                    message={message}
                                />

                        )
                    }) :
                    <>
                        <img src={imgChat.src} width={303} height={296} alt="chat img" />
                        <h3>Select a chat to start a conversation</h3>
                    </>
            }
        </div>
    );
}

export default Messsages;