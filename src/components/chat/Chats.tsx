import defaultAvatar from '@/assets/avatars/avatar.png';

import { useContext, useEffect, useState } from 'react';
import { UserInterface } from '@/models/user';
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { ChatContext } from '@/context/chatContext';
import { userChatInterface } from '@/interfaces/chat';
import moment from 'moment/moment';


function Chats({
    setIndividualChat,
    currentUser
}: {
    setIndividualChat?: (state: boolean) => void;
    currentUser: UserInterface | null
}) {
    const [userChats, setChats] = useState<DocumentData | undefined>();
    const contextChat = useContext(ChatContext);
    const dispatch = contextChat?.dispatch;

    const handleSelect = (u: userChatInterface) => {
        dispatch && dispatch({ type: 'CHANGE_USER', payload: u })
    }

    useEffect(() => {
        if (!currentUser) {
            return
        }
        const unsub = onSnapshot(doc(firestore, 'userChats', currentUser.uid), (doc) => {
            setChats(doc.data())
        });
        return () => {
            unsub()
        }
    }, [currentUser])

    return (
        userChats && Object.entries(userChats).map((chat) => {
            const lastMessage: string = chat[1].lastMessage?.text
            const shortMessage = lastMessage ? lastMessage.slice(0, 24) : 'No messages'

            const thisDate = chat[1].date ? moment.unix(chat[1].date?.seconds).startOf('seconds').fromNow() : 'No time'

            return (
                <div
                    key={chat[0]}
                    tabIndex={0}
                    role='button'
                    className="userchat"
                    onClick={() => {
                        setIndividualChat && setIndividualChat(true)
                        handleSelect(chat[1].userInfo)
                    }
                    }>
                    <img src={defaultAvatar.src} alt="avatar" />

                    <div className='userchat_info'>
                        <span>{chat[1].userInfo.firstName} {chat[1].userInfo.lastName}</span>
                        <p>{shortMessage}{shortMessage.length >= 24 && '...'}</p>
                        <p>{!lastMessage && 'Created'} {thisDate}</p>
                    </div>
                </div >
            )
        })
    );
}

export default Chats;