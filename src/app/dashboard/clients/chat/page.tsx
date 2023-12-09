import Routes from "@/models/routes";
import ClientChatContainer from "./client/chat-container";
import MainClientLayout from "../main/client/MainClientLayout";

function page() {
    return (
        <MainClientLayout currentPage={Routes.clients.dashboard}>
            <ClientChatContainer />
        </MainClientLayout>
    );
}

export default page;