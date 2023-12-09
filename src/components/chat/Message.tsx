import defaultAvatar from '@/assets/avatars/avatar.png'
import moment from 'moment/moment';
import { individualMessageInterface } from '@/interfaces/chat';

function Message({
    typeUser,
    message
}: {
    typeUser: string,
    message: individualMessageInterface;
}) {
    return (
        <div className={`message ${typeUser}`}>
            <div className='message__info'>
                <p>{message.text}</p>
                <div className='message__info-avatar'>
                    <img src={defaultAvatar.src} alt="avatar" />
                    <span>{moment.unix(message.date.seconds).startOf('seconds').fromNow()}</span>
                </div>
            </div>
            {
                message.img != undefined && message.img.length > 0 &&
                <figure className='message__img'>
                    <img
                        alt='img chat'
                        src={message.img}
                    />
                </figure>
            }
            {
                message.file != undefined && message.file?.length > 0 &&
                <a
                    href={message.file}
                    target='_blank'>
                    Download file
                </a>
            }
        </div>
    );
}

export default Message;