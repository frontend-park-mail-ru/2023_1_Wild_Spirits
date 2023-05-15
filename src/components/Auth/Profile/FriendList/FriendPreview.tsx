import { VDOM } from "modules/vdom";
import { ProfileLink } from "components/Common/Link";
import { closeModal } from "flux/slices/modalWindowSlice";
import { store } from "flux";

export interface FriendPreviewNoLinkProps {
    name: string;
    avatar: string;
    children?: JSX.Element;
}

export interface FriendPreviewProps extends FriendPreviewNoLinkProps {
    user_id: number;
}

export const FriendPreviewNoLink = ({ name, avatar, children }: FriendPreviewNoLinkProps) => {
    return (
        <span className="friend-list__item">
            <div className="friend-list__item__avatar-block">
                <img className="friend-list__item__avatar" src={avatar} />
                <div className="friend-list__item__description">
                    <span className="friend-list__item__friend-name">{name}</span>
                </div>
            </div>
            {children}
        </span>
    );
};

export const FriendPreview = (user: FriendPreviewProps) => {
    return (
        <ProfileLink
            className="friend-list__link"
            href={`/profile/${user.user_id}`}
            onClick={() => store.dispatch(closeModal())}
        >
            <FriendPreviewNoLink avatar={user.avatar} name={user.name} />
        </ProfileLink>
    );
};

export const FriendsPreviewBlock = ({
    title,
    users,
}: {
    title: string;
    users: { user_id: number; name: string; avatar: string }[];
}) => {
    return (
        <div>
            {users.length > 0 && (
                <div>
                    <h2>{title}</h2>
                    {users.map(FriendPreview)}
                </div>
            )}
        </div>
    );
};
