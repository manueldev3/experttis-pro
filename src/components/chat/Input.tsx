import { useContext, useState, useRef } from 'react'
import useAuth from "@/hook/auth_hook";
import { ChatContext } from '@/context/chatContext';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Timestamp, arrayUnion, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, storage } from '@/firebase/config';

import { notification } from "antd";

function Input() {
    const { currentUser } = useAuth();
    const [text, setText] = useState('');
    const [img, setImg] = useState<File | null>();
    const [file, setFile] = useState<File | null>();

    const fileRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);

    const contextChat = useContext(ChatContext);
    if (!contextChat) {
        return null
    }

    const { data } = contextChat;

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, `chat_images/${crypto.randomUUID()}`)
            if (currentUser) {
                await uploadBytes(storageRef, img).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(firestore, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: crypto.randomUUID(),
                                text,
                                senderId: currentUser.uid,
                                receptorId: data.user.uid,
                                img: downloadURL,
                                date: Timestamp.now(),
                            }),
                        });
                    });
                });
            }
        } else if (file) {
            const storageRef = ref(storage, `chat_files/${crypto.randomUUID()}`)
            if (currentUser) {
                await uploadBytes(storageRef, file).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(firestore, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: crypto.randomUUID(),
                                text,
                                senderId: currentUser.uid,
                                receptorId: data.user.uid,
                                file: downloadURL,
                                date: Timestamp.now(),
                            }),
                        });
                    });
                });
            }
        } else {
            await updateDoc(doc(firestore, "chats", data.chatId), {
                messages: arrayUnion({
                    id: crypto.randomUUID(),
                    text,
                    senderId: currentUser?.uid,
                    receptorId: data.user.uid,
                    date: Timestamp.now()
                })
            })
        }

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
        setImg(null);
        setFile(null);
    }

    return (
        <form className="input_container">
            <input
                id='messageText'
                type="text"
                value={text}
                maxLength={320}
                className="input_message"
                placeholder="Type a message"
                onChange={(e) => setText(e.target.value)}
            />


            <div className="attach">
                <input
                    id='file'
                    type="file"
                    ref={fileRef}
                    style={{ display: 'none' }}
                    accept='.pdf, .doc, .xlsx, .csv, .txt'
                    max={'2mb'}
                    onChange={(e) => {
                        if (fileRef.current?.files && fileRef.current?.files?.[0].size <= 2000000) {
                            setFile(e.target.files?.[0])
                            notification.success({
                                message: 'File selected',
                                description: 'You have selected a valid file',
                                placement: 'bottom',
                            });
                        } else {
                            setImg(null)
                            notification.warning({
                                message: 'Max size exceded',
                                description: 'Choose a file with min size',
                                placement: 'bottom',
                            });
                        }
                    }}
                />
                <label htmlFor="file">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M10.409 0c4.857 0 3.335 8 3.335 8 3.009-.745 8.256-.419 8.256 3v11.515l-4.801-4.801c.507-.782.801-1.714.801-2.714 0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.037 0 2-.316 2.799-.858l4.858 4.858h-18.657v-24h8.409zm2.591 12c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm1.568-11.925c2.201 1.174 5.938 4.884 7.432 6.882-1.286-.9-4.044-1.657-6.091-1.18.222-1.468-.186-4.534-1.341-5.702z" /></svg>
                </label>
                <input
                    id='img'
                    type="file"
                    ref={imgRef}
                    style={{ display: 'none' }}
                    accept='image/png, image/jpeg'
                    max={'6mb'}
                    onChange={(e) => {
                        if (imgRef.current?.files && imgRef.current?.files?.[0].size <= 8000000) {
                            setImg(e.target.files?.[0])
                            notification.success({
                                message: 'Image selected',
                                description: 'You have selected a valid image',
                                placement: 'bottom',
                            });
                        } else {
                            setImg(null)
                            notification.warning({
                                message: 'Max size exceded',
                                description: 'Choose a image with min size',
                                placement: 'bottom',
                            });
                        }
                    }}
                />
                <label htmlFor="img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path d="M9 12c0-.552.448-1 1.001-1s.999.448.999 1-.446 1-.999 1-1.001-.448-1.001-1zm6.2 0l-1.7 2.6-1.3-1.6-3.2 4h10l-3.8-5zm8.8-5v14h-20v-3h-4v-15h21v4h3zm-20 9v-9h15v-2h-17v11h2zm18-7h-16v10h16v-10z" /></svg>
                </label>
            </div>
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

export default Input;