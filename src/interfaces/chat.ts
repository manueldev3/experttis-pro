export interface userChatInterface {
    uid: string,
    firstName: string,
    lastName: string
}

export interface State {
    chatId: string;
    user: userChatInterface;
}

export interface Action {
    type: string;
    payload?: userChatInterface;
}

export interface ContextChatProps {
    data: State;
    dispatch: React.Dispatch<Action>;
}

export interface individualMessageInterface {
    date: {
        seconds: number,
        nanoseconds: number,
    },
    id: string,
    img?: string,
    file?: string,
    senderId: string,
    receptorId: string,
    text: string
}