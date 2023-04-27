/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { Link } from "components/Common/Link";
import { requestManager } from "requests";
import { loadFriends, searchUsers } from "requests/user";

import { store } from "flux";
import { close } from "flux/slices/modalWindowSlice";

import { getUploadsImg } from "modules/getUploadsImg";
import { setFriendSearchQuery } from "flux/slices/friendsListSlice";

import "./styles.scss"

export class FriendList extends Component {
    constructor() {
        super({});
    }

    didCreate() {
        const id = store.state.user.currentProfile?.id;

        if (id === undefined) {
            return;
        }

        const searchName = store.state.friendList.friendSearchQuery;
        requestManager.request(loadFriends, id, searchName);
    }

    #reload = (event: Event) => {
        const input = event.target as HTMLInputElement;

        if (!input) {
            return;
        }

        const searchName = input.value;
        const id = store.state.user.currentProfile?.id;
        if (id === undefined) {
            return;
        }

        store.dispatch(setFriendSearchQuery(searchName));
        requestManager.request(loadFriends, id, searchName);
        requestManager.request(searchUsers, searchName);
    };

    render(): JSX.Element {
        
        const renderUser = (user: {user_id: number, name: string, avatar: string}) => {
            return (
                <div className="friend-list__item">
                    <Link href={`/profile/${user.user_id}`} onClick={() => store.dispatch.bind(store)(close())}>
                        <div className="friend-list__item__avatar-block">
                            <img className="friend-list__item__avatar" src={user.avatar} />
                            <div className="friend-list__item__description">
                                <span className="friend-list__item__friend-name">{user.name}</span>
                            </div>
                        </div>
                    </Link>
                    <div className="tick-friend-icon-container"></div>
                </div>
            );
        }

        const friends = store.state.friendList.friends
            .map(({ id, name, img }) => ({
                user_id: id,
                name: name,
                avatar: getUploadsImg(img),
            }))

        let filtered_ids = friends.map(friend => friend.user_id)

        if (store.state.user.data) {
            filtered_ids.push(store.state.user.data.id)
        }

        const foundUsers = store.state.friendList.foundUsers
            .map(({ id, name, img }) => ({
                user_id: id,
                name: name,
                avatar: getUploadsImg(img),
            }))
            .filter(user => !filtered_ids.includes(user.user_id))

        return (
            <div>
                <h2 className="friend-list__title">Друзья</h2>

                <input
                    type="text"
                    onChange={(e) => this.#reload(e as unknown as Event)}
                    className="search friend-search"
                    placeholder="Поиск"
                    value={store.state.friendList.friendSearchQuery}
                />

                <div className="friend-list">
                    {
                        (friends.length > 0) && friends.length > 0 && <div>
                            <h2>Друзья</h2>
                            {friends.map(renderUser)}
                        </div>
                    }
                    {
                        (store.state.friendList.friendSearchQuery !== '' && foundUsers.length > 0) && <div>
                            <h2>Все пользователи</h2>
                            {foundUsers.map(renderUser)}
                        </div>
                    }
                </div>
            </div>
        );
    }
}
