import defaultAvatar from '@/assets/avatars/avatar.png';
import { DocumentData } from "firebase-admin/firestore";
import User from '@/models/user';

function FindUser({
    setIndividualChat,
    user,
    initChatWithSelectedUser
}: {
    setIndividualChat?: (state: boolean) => void;
    user: DocumentData | User | null | undefined;
    initChatWithSelectedUser: () => void;
}) {
    if (user) {
        return (
            <div
                tabIndex={0}
                role='button'
                className="userchat"
                onClick={() => {
                    setIndividualChat && setIndividualChat(true)
                    initChatWithSelectedUser()
                }
                }>
                <img src={defaultAvatar.src} alt="avatar" />

                <div className='userchat_info'>
                    <span>{user.firstName} {user.lastName}</span>
                </div>
            </div >
        );
    } else {
        <span>No se ha encontrado ningún usuario</span>
    }
}

export default FindUser;