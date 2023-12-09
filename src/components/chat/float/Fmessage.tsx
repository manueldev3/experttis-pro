import moment from 'moment';
import defaultAvatar from '@/assets/avatars/avatar.png'
import { individualMessageInterface } from '@/interfaces/chat';

function Fmessage({
    typeUser,
    thisMessage
}: {
    typeUser: string,
    thisMessage: individualMessageInterface;
}) {
    return (
        <div className={`fmessage ${typeUser}`}>
            <div className='message__info'>
                <p>{thisMessage.text}</p>
                <div className='message__info-avatar'>
                    <img src={defaultAvatar.src} alt="avatar" />
                    <span>
                        {moment.unix(thisMessage.date.seconds).startOf('seconds').fromNow()}
                    </span>
                </div>
            </div>

            {
                thisMessage.img != undefined && thisMessage.img.length > 0 &&
                <figure className='message__img'>
                    <img
                        alt='img chat'
                        src={thisMessage.img}
                    />
                </figure>
            }
            {
                thisMessage.file != undefined && thisMessage.file?.length > 0 &&
                <a
                    href={thisMessage.file}
                    target='_blank'>
                    Download file
                </a>
            }
        </div>
    );
}

export default Fmessage;