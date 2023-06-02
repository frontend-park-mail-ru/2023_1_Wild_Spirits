import { VDOM } from "modules/vdom";
import { ProfileLink } from "components/Common/Link";
import { closeModal } from "flux/slices/modalWindowSlice";
import { store } from "flux";
import { SVGInline } from "components/Common/SVGInline";
import { requestManager } from "requests";
import { addFriend } from "requests/user";

export interface FriendPreviewNoLinkProps {
    name: string;
    avatar: string;
    children?: JSX.Element;
}

export interface FriendPreviewProps extends FriendPreviewNoLinkProps {
    user_id: number;
    is_friend: boolean;
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

const SubscribeButton = (props: {user: FriendPreviewProps}) => {
    const subscribe = () => {
        const userData = {
            id: props.user.user_id,
            name: props.user.name,
            img: props.user.avatar
        }
        requestManager.request(addFriend, userData);
    };
    return (
        <button 
            onClick={()=>{
                subscribe();
            }} 
            className="transparent-svg-button"
        >
            <SVGInline
                src="/assets/img/add-friend-icon.svg"
                alt="Подписаться"

            />
        </button>
    )
}

export const FriendPreview = (user: FriendPreviewProps) => {
    return (
        <div className="friend-list__link-container">
            <ProfileLink
                className="friend-list__link"
                href={`/profile/${user.user_id}`}
                onClick={() => {
                        store.dispatch(closeModal());
                    }
                }
            >
            <FriendPreviewNoLink avatar={user.avatar} name={user.name} />
            </ProfileLink>
            {
                user.is_friend
                ?   <SVGInline
                        src="/assets/img/tick-friend-icon.svg"
                        alt="Подписан"
                    />
                : <SubscribeButton user={user}/>

            }
        </div>
    );
};

export const FriendsPreviewBlock = ({
    title,
    users,
}: {
    title: string;
    users: { user_id: number; name: string; avatar: string; is_friend: boolean }[];
}) => {
    return (
        <div>
            {users.length > 0 && (
                <div>
                    <h2>{title}</h2>
                    <div className="friend-list__list">
                        {users.map(FriendPreview)}
                    </div>
                </div>
            )}
        </div>
    );
};
