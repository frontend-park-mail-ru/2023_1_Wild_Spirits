import { VDOM } from "modules/vdom";
import { ProfileLink } from "components/Common/Link";

export interface FriendLinkProps {
    userId: number;
    name: string;
    avatar: string;
    onClick?: ()=>void;
}

export const FriendLink = ({ userId, name, avatar, onClick }: FriendLinkProps) => {
    const href = `/profile/${userId}`;
    return (
        <ProfileLink
            href={href}
            className="friend-list-card__friends-block__block-item"
            onClick={onClick}
        >
            <img src={avatar} className="friend-list-card__friends-block__avatar" />
            <span className="black-link">{name}</span>
        </ProfileLink>
    );
};
