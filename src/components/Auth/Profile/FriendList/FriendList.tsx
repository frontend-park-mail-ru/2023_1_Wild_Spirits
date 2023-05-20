/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { requestManager } from "requests";
import { loadFriends, searchUsers } from "requests/user";

import { store } from "flux";

import { setFriendSearchQuery } from "flux/slices/friendsListSlice";
import { toEvent } from "modules/CastEvents";
import { FriendsPreviewBlock } from "./FriendPreview";
import { isAuthorizedOrNotDone } from "flux/slices/userSlice";

export class FriendList extends Component {
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
        const friends = (() => {
            if (store.state.friendList.friends === null) {
                return [];
            }

            return store.state.friendList.friends.map(({ id, name, img }) => ({
                user_id: id,
                name: name,
                avatar: img,
                is_friend: true,
            }));
        })();

        const filtered_ids = friends.map((friend) => friend.user_id);

        const { authorized } = store.state.user;
        if (isAuthorizedOrNotDone(authorized)) {
            filtered_ids.push(authorized.data.id);
        }

        const foundUsers = (() => {
            if (store.state.friendList.foundUsers === null) {
                return [];
            }

            return store.state.friendList.foundUsers
                .map(({ id, name, img }) => ({
                    user_id: id,
                    name: name,
                    avatar: img,
                    is_friend: false,
                }))
                .filter((user) => !filtered_ids.includes(user.user_id));
        })();

        const queryEmpty = store.state.friendList.friendSearchQuery !== "";
        const empty = queryEmpty && friends.length === 0 && foundUsers.length === 0;

        return (
            <div>
                <div className="friend-list__header">
                    <h2 className="friend-list__title">Подписки</h2>

                    <input
                        type="text"
                        onChange={(e) => this.#reload(toEvent(e))}
                        className="search friend-search"
                        placeholder="Поиск"
                        value={store.state.friendList.friendSearchQuery}
                    />
                </div>

                {empty ? (
                    <div>Пользователей с таким именем не найдено</div>
                ) : (
                    <div className="friend-list">
                        <FriendsPreviewBlock title="Подписки" users={friends} />
                        {queryEmpty && <FriendsPreviewBlock title="Все пользователи" users={foundUsers} />}
                    </div>
                )}
            </div>
        );
    }
}
