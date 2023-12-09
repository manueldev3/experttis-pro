'use client'

import Sidebar from "@/components/chat/Sidebar";
import Chat from "@/components/chat/Chat";

function ConsultantChatContainer() {
    return (
        <section className="chat__section">
            <div className="chat__container">
                <Sidebar typeuser={'Consultant'} />
                <Chat />
            </div>
        </section>
    );
}

export default ConsultantChatContainer;