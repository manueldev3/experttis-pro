import Messsages from "./Messages";
import Input from "./Input";
import { CaretDownOutlined } from '@ant-design/icons';

import { useState, useContext } from 'react';
import { ChatContext } from "@/context/chatContext";

function Chat() {
    const contextChat = useContext(ChatContext);
    const [dropdown, setDropdown] = useState<boolean>(false);

    if (!contextChat) {
        return null;
    }

    const { data } = contextChat;

    return (
        <div className="chat">
            <div className="chat_head">
                {
                    data.user.uid.length > 2 ?
                        <p>Chat: {data.user?.firstName} {data.user?.lastName}</p> :
                        <p>Select a chat first</p>
                }
                <button type="button" onClick={() => setDropdown(!dropdown)}>
                    <CaretDownOutlined />
                </button>

                {
                    dropdown &&
                    <div className="dropdown">
                        <ul>
                            <li>
                                <button type="button" className="delete">Delete chat</button>
                            </li>
                        </ul>
                    </div>
                }
            </div>

            <Messsages />
            {
                data.user.uid.length > 2 &&
                <Input />
            }
        </div>
    );
}

export default Chat;