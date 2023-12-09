'use client'
import '@/styles/css/main.css';

import Sidebar from "@/components/chat/Sidebar";
import Chat from "@/components/chat/Chat";

function ClientChatContainer() {
    return (
        <section className="chat__section">
            <div className="chat__container">
                <Sidebar typeuser={'Client'} />
                <Chat />
            </div>
        </section>
    );
}

export default ClientChatContainer;