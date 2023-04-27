/** @module Components */

import { VDOM, Component, patchVDOM } from "modules/vdom";

import { createTable } from "components/Common/CreateTable";
// import { Component } from "components/Component";

import { store } from "flux";
import { setData, setCurrentProfile, kickUnauthorized } from "flux/slices/userSlice";

// import ProfileTemplate from "templates/Auth/Profile/Profile.handlebars";
// import TableTemplate from "templates/Common/Table.handlebars";
// import EditTableTemplate from "templates/Common/EditProfileTable.handlebars";
import { getCitiesNames } from "flux/slices/headerSlice";

import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserEdit } from "responses/ResponsesUser";
import { addFriend, loadFriends, loadProfile } from "requests/user";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { ResponseErrorDefault } from "responses/ResponseBase";
import { requestManager } from "requests";

/**
 * Profile component
 * @class
 * @extends Component
 */
export class Profile extends Component<{ id: number }, { editing: boolean }> {
    #tempAvatarUrl: string | undefined;
    #errorMsg: string = "";

    constructor(props: { id: number }) {
        super(props);
        this.state = { editing: false };

        // this.loadProfile();

        // this.registerEvent(
        //     () => document.getElementById("edit-profile-btn"),
        //     "click",
        //     (() => {
        //         this.#editing = true;
        //         this.rerender();
        //     }).bind(this)
        // );
        // this.registerEvent(() => document.getElementById("edit-profile-form"), "submit", this.#submitForm);
        // this.registerEvent(() => document.getElementById("edit-profile-form"), "change", this.#formChanged);
        // this.registerEvent(() => document.getElementById("add-friend-btn"), "click", this.#addFriend);
    }

    didCreate(): void {
        this.loadProfile();
    }

    didUpdate(): void {
        this.loadProfile();
    }

    #formChanged = (event: Event) => {
        let input = event.target as HTMLInputElement;

        if (!input || input.getAttribute("type") !== "file") {
            return;
        }

        const inputFiles = (input as HTMLInputElement).files;

        if (!inputFiles) {
            return;
        }

        const image = inputFiles[0];
        this.#tempAvatarUrl = URL.createObjectURL(image);

        this.setState({ editing: false });
    };

    getProfileId(): number | undefined {
        const url = router.getNextUrl();
        if (url === undefined) {
            const user_data = store.state.user.data;
            return user_data !== undefined ? user_data.id : undefined;
        }
        return parseInt(url.slice(1));
    }

    loadProfile() {
        // const id = this.getProfileId();

        // console.log(this.props)
        console.log("load profile", this.props.id);
        requestManager.request(loadProfile, this.props.id);

        // if (id !== undefined) {
        //     requestManager.request(loadProfile, id);
        // }
    }

    #addFriend = () => {
        const id = this.getProfileId();

        if (id !== undefined) {
            requestManager.request(addFriend, id);
        }
    };

    #submitForm = (event: SubmitEvent) => {
        event.preventDefault();

        const form = event.target;

        if (!form) {
            return;
        }

        const userData = store.state.user.data;

        if (!userData) {
            return;
        }

        let formData = new FormData(form as HTMLFormElement);
        const city_id = store.state.header.cities.find((city) => city.name === formData.get("city_id"));

        if (!city_id) {
            return;
        }

        formData.set("city_id", city_id.id.toString());

        if (this.#tempAvatarUrl !== undefined) {
            toWebP(this.#tempAvatarUrl, (imageBlob: Blob) => {
                formData.set("avatar", imageBlob);

                this.#sendForm(userData.id, formData);
            });
        } else {
            this.#sendForm(userData.id, formData);
        }
    };

    #sendForm(user_id: number, formData: FormData) {
        ajax.removeHeaders("Content-Type");
        ajax.patch<ResponseUserEdit, ResponseErrorDefault>({
            url: `/users/${user_id}`,
            credentials: true,
            body: formData,
        }).then(({ json, response, status }) => {
            if (status === AjaxResultStatus.SUCCESS) {
                store.dispatch(
                    setData({ ...json.body.user }),
                    setCurrentProfile({ profile: json.body, id: store.state.user.data!.id })
                );
            } else if (response.status === 409) {
                let errorMsgElement = document.getElementById("profile-description-error-message");
                if (errorMsgElement) {
                    errorMsgElement.textContent = json.errorMsg;
                }
            }
        });
        ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });

        this.setState({ editing: false });
    }

    render(): JSX.Element {
        if (kickUnauthorized(store.state.user)) {
            return <span></span>;
        }

        const getTable = (profile_data: {
            id: number;
            name: string;
            img: string;
            email?: string | undefined;
            city_name?: string;
        }) => {
            if (this.state.editing) {
                const cities = getCitiesNames(store.state.header);
                const city = store.state.user.currentProfile?.city_name;

                return (
                    <div className="table">
                        <div className="table__cell grey">Имя</div>
                        <div className="table__cell">
                            <input className="form-control" name="name" type="text" value={profile_data.name} />
                        </div>

                        <div className="table__cell grey">Город</div>
                        <div className="table__cell">
                            <div className="header__city__selector">
                                <select name="city_id" value={city} id="profile-city-select">
                                    {cities.map((city) => (
                                        <option>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            }
            const rows = createTable({
                Имя: profile_data.name,
                Почта: profile_data.email ? profile_data.email : "не указана",
                Город: profile_data.city_name ? profile_data.city_name : "Москва",
            });

            let cells = [];

            for (const row of rows) {
                cells.push(<div className="table__cell grey">{row.title}</div>);
                cells.push(<div className="table__cell">{row.value}</div>);
            }

            return <div className="table">{cells}</div>;
        };

        const user_data = store.state.user.data;
        if (!user_data) {
            return <span>Вы не авторизованы</span>;
        }

        const profile_data = store.state.user.currentProfile;

        if (!profile_data) {
            return <span>Такого пользователя не существует</span>;
        }

        const avatar = getUploadsImg(store.state.user.currentProfile!.img);
        const table = getTable(profile_data);

        const profileBtn = () => {
            const mine = user_data.id === profile_data.id;

            if (mine) {
                if (this.state.editing) {
                    return [
                        <input className="button" type="submit" value="Сохранить" />,
                        <span className="warning" id="profile-description-error-message">
                            {this.#errorMsg}
                        </span>,
                    ];
                }
                return (
                    <input
                        type="button"
                        id="edit-profile-btn"
                        onClick={() => {
                            this.setState({ editing: true });
                        }}
                        className="button"
                        value="Редактировать"
                    ></input>
                );
            }

            const isFriend = store.state.user.currentProfile?.is_friend;

            if (isFriend) {
                return <span>Вы дружите</span>;
            }

            return <input onClick={this.#addFriend} className="button" value="Добавить в друзья"></input>;
        };

        return (
            <form
                id="edit-profile-form"
                onSubmit={(event) => {
                    this.#submitForm(event as unknown as SubmitEvent);
                }}
                className="profile-description"
            >
                <div className="profile-description__img-container">
                    <label htmlFor="avatar-picker">
                        <img
                            src={avatar}
                            className={"profile-description__img" + (this.state.editing ? " pointy" : "")}
                        />
                    </label>

                    {this.state.editing && (
                        <input
                            className="invisible"
                            id="avatar-picker"
                            type="file"
                            accept="image/*"
                            name="avatar"
                        ></input>
                    )}
                </div>
                <div className="profile-description__description-block">
                    <div className="profile-description__table-container">{table}</div>
                    <div className="profile-description__button-block">{profileBtn()}</div>
                </div>
            </form>
        );
    }
}
