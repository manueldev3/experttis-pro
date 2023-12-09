import defaultAvatar from '@/assets/avatars/avatar.png';

function Navbar({
    typeuser
}: {
    typeuser: string
}) {
    return (
        <div className="navbar">
            <span className="type">{typeuser} chat</span>
            <div className="user">
                <img src={defaultAvatar.src} alt="avatar" />
                <span>Joel Tuiran</span>
            </div>
        </div>
    );
}

export default Navbar;