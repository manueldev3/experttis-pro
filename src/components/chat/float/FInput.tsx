import useAuth from "@/hook/auth_hook";
import { notification } from "antd";
import { useState, useContext } from "react";
import { firestore } from "@/firebase/config";
import { ChatContext } from "@/context/chatContext";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";

function Finput() {
    const { currentUser } = useAuth();
    const [text, setText] = useState('');

    const contextChat = useContext(ChatContext);
    if (!contextChat) {
        return null
    }

    const { data } = contextChat;

    const handleSend = async () => {
        await updateDoc(doc(firestore, "chats", data.chatId), {
            messages: arrayUnion({
                id: crypto.randomUUID(),
                text,
                senderId: currentUser?.uid,
                receptorId: data.user.uid,
                date: Timestamp.now()
            })
        })

        if (currentUser) {
            await updateDoc(doc(firestore, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: Timestamp.now(),
            });
        }

        await updateDoc(doc(firestore, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: Timestamp.now(),
        });

        setText('');
    }

    return (
        <form className="input_container" action={''}>
            <input
                id='messageText'
                type="text"
                value={text}
                maxLength={320}
                className="input_message"
                placeholder="Type a message"
                onChange={(e) => setText(e.target.value)}
            />
            <button
                type={'submit'}
                onClick={(e) => {
                    e.preventDefault();
                    if (text.length > 1) {
                        handleSend()
                    } else {
                        notification.warning({
                            message: 'Valid text',
                            description: 'No valid text',
                            placement: 'bottom',
                        });
                    }
                }}
            >
                Send
            </button>
        </form>
    );
}

export default Finput;