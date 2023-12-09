import Chats from "../Chats";
import useAuth from "@/hook/auth_hook";
import { useState, useEffect, useContext } from 'react';
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { ArrowsAltOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ChatContext } from "@/context/chatContext";

import Finput from './FInput';
import Fmesssages from "./Fmesagges";
import { firestore } from "@/firebase/config";

function FloatChat() {
    const { currentUser } = useAuth();
    const [userChats, setChats] = useState<DocumentData | undefined>();
    const [showBody, setShowBody] = useState<boolean>(false);
    const [showIndividualChat, setIndividualChat] = useState<boolean>(false);

    const contextChat = useContext(ChatContext);
    const data = contextChat?.data

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(firestore, 'userChats', currentUser.uid), (doc) => {
                setChats(doc.data())
            });
            return () => {
                unsub()
            }
        }
    }, [currentUser])

    return (
        <section className="floatChat__container">
            <div className="floatChat__container-head">
                <h3>Chats with us</h3>
                {
                    showIndividualChat ?
                        <ArrowLeftOutlined
                            className="close-conversation"
                            onClick={() => {
                                setIndividualChat(false)
                            }}
                        /> :
                        <span
                            className="length">
                            {userChats ? Object.entries(userChats).length : '0'}
                        </span>
                }

                <ArrowsAltOutlined className="close" onClick={() => setShowBody(!showBody)} />
            </div>
            {
                showBody &&
                <>
                    {
                        !showIndividualChat ?
                            <Chats
                                currentUser={currentUser}
                                setIndividualChat={setIndividualChat}
                            /> :
                            <>
                                <div className="floatChat__container-info">
                                    <span>Conversation:</span>
                                    {
                                        data &&
                                        <p>{data.user.firstName} {data.user.lastName}</p>
                                    }
                                </div>
                                <Fmesssages />
                                <Finput />
                            </>
                    }
                </>
            }
        </section>
    );
}

export default FloatChat;