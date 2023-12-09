import { SetStateAction, Dispatch } from "react";

function Search({
    handleKey,
    setUserName,
    userName
}: {
    handleKey: (e: any) => void,
    setUserName: Dispatch<SetStateAction<string | undefined>>,
    userName: string | undefined;
}) {
    return (
        <div className="searchChat">
            <div className="searchForm">
                <input
                    placeholder='find a user'
                    type="text"
                    onKeyDown={handleKey}
                    onChange={e => setUserName(e.target.value)}
                    value={userName}
                />
            </div>
        </div>
    );
}

export default Search;