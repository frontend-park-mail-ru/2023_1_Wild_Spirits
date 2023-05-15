import { VDOM } from "modules/vdom";
import { ProfileLink } from "components/Common/Link";

export interface FriendLinkProps {
    userId: number;
    name: string;
    avatar: string;
}

export const FriendLink = ({ userId, name, avatar }: FriendLinkProps) => {
    const href = `/profile/${userId}`;
    return (
        <ProfileLink href={href} className="friend-list-card__friends-block__block-item">
            <img src={avatar} className="friend-list-card__friends-block__avatar" />
            <span className="black-link">{name}</span>
        </ProfileLink>
    );
};
