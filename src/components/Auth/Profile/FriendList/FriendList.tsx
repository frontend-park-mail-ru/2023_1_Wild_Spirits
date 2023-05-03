/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { ProfileLink } from "components/Common/Link";
import { requestManager } from "requests";
import { loadFriends, searchUsers } from "requests/user";

import { store } from "flux";
import { close } from "flux/slices/modalWindowSlice";

import { getUploadsImg } from "modules/getUploadsImg";
import { setFriendSearchQuery } from "flux/slices/friendsListSlice";

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
        const renderUser = (user: { user_id: number; name: string; avatar: string }) => {
            return (
                <ProfileLink
                    className="friend-list__item"
                    href={`/profile/${user.user_id}`}
                    onClick={() => store.dispatch(close())}
                >
                    <span className="link">
                        <div className="friend-list__item__avatar-block">
                            <img className="friend-list__item__avatar" src={user.avatar} />
                            <div className="friend-list__item__description">
                                <span className="friend-list__item__friend-name">{user.name}</span>
                            </div>
                        </div>
                    </span>
                    <div className="tick-friend-icon-container"></div>
                </ProfileLink>
            );
        };

        const friends = (() => {
            if (store.state.friendList.friends === null) {
                return [];
            }

            return store.state.friendList.friends.map(({ id, name, img }) => ({
                user_id: id,
                name: name,
                avatar: getUploadsImg(img),
            }));
        })();

        let filtered_ids = friends.map((friend) => friend.user_id);

        if (store.state.user.data) {
            filtered_ids.push(store.state.user.data.id);
        }

        const foundUsers = (() => {
            if (store.state.friendList.foundUsers === null) {
                return [];
            }

            return store.state.friendList.foundUsers
                .map(({ id, name, img }) => ({
                    user_id: id,
                    name: name,
                    avatar: getUploadsImg(img),
                }))
                .filter((user) => !filtered_ids.includes(user.user_id));
        })();

        const UserBlock = ({
            title,
            users,
        }: {
            title: string;
            users: { user_id: number; name: string; avatar: string }[];
        }) => {
            return (
                <div>
                    {users.length > 0 && users.length > 0 && (
                        <div>
                            <h2>{title}</h2>
                            {users.map(renderUser)}
                        </div>
                    )}
                </div>
            );
        };

        const queryEmpty = store.state.friendList.friendSearchQuery !== "";
        const empty = queryEmpty && friends.length === 0 && foundUsers.length === 0;

        return (
            <div>
                <div className="friend-list__header">
                    <h2 className="friend-list__title">Подписки</h2>

                    <input
                        type="text"
                        onChange={(e) => this.#reload(e as unknown as Event)}
                        className="search friend-search"
                        placeholder="Поиск"
                        value={store.state.friendList.friendSearchQuery}
                    />
                </div>

                {empty ? (
                    <div>Пользователей с таким именем не найдено</div>
                ) : (
                    <div className="friend-list">
                        <UserBlock title="Подписки" users={friends} />
                        {queryEmpty && <UserBlock title="Все пользователи" users={foundUsers} />}
                    </div>
                )}
            </div>
        );
    }
}
