'use client'

import { createContext, ReactNode, useReducer } from "react";
import useAuth from "@/hook/auth_hook";
import { ContextChatProps, State, Action } from "@/interfaces/chat";

// import type { User } from "firebase/auth";
// import User from "@/models/user";

export const ChatContext = createContext<ContextChatProps | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();

    const INITIAL_STATE: State = {
        chatId: "0",
        user: {
            uid: '0',
            firstName: '',
            lastName: ''
        },
    };

    const chatReducer = (state: State, action: Action): State => {
        switch (action.type) {
            case "CHANGE_USER":
                if (currentUser) {
                    return {
                        user: action.payload || {
                            uid: '0',
                            firstName: '',
                            lastName: ''
                        },
                        chatId:
                            currentUser.uid > (action.payload?.uid || "")
                                ? currentUser.uid + (action.payload?.uid || "")
                                : (action.payload?.uid || "") + currentUser.uid,
                    };
                }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};
