import Routes from '@/models/routes';
import ConsultantChatContainer from '@/app/dashboard/consultants/chat/client/chat-container';
import MainLayout from '../main/client/MainLayout';

function page() {
    return (
        <MainLayout currentPage={Routes.consultants.dashboard}>
            <ConsultantChatContainer />
        </MainLayout>
    );
}

export default page;