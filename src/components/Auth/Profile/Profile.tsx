/** @module Components */

import { VDOM, Component, patchVDOM } from "modules/vdom";

import { createTable, filterTableContents, TableContents } from "components/Common/CreateTable";
import { store } from "flux";
import {
    setUserData,
    setCurrentProfile,
    kickUnauthorized,
    isOrganizer,
    CurrentProfileState,
    TOrganizer,
} from "flux/slices/userSlice";

import { getCitiesNames } from "flux/slices/headerSlice";

import { AjaxResultStatus, ajax } from "modules/ajax";
import { ResponseUserEdit } from "responses/ResponsesUser";
import { addFriend, deleteFriend, loadFriends, loadProfile } from "requests/user";
import { router } from "modules/router";
import { toWebP } from "modules/imgConverter";
import "./styles.scss";
import { getUploadsImg } from "modules/getUploadsImg";
import { ResponseErrorDefault } from "responses/ResponseBase";
import { requestManager } from "requests";
import { toEvent, toSubmitEvent } from "modules/CastEvents";

import { mineProfile } from "flux/slices/userSlice";
import { TFriend, TUserLight } from "models/User";

/**
 * Profile component
 * @class
 * @extends Component
 */
export class Profile extends Component<{ id: number }, { editing: boolean; tempAvatarUrl: string | undefined }> {
    #tempAvatarUrl: string | undefined;
    #errorMsg: string = "";

    constructor(props: { id: number }) {
        super(props);
        this.state = { editing: false, tempAvatarUrl: undefined };

        this.setEditing = this.setEditing.bind(this);
        this.unsetEditing = this.unsetEditing.bind(this);
        this.submitForm = this.submitForm.bind(this);
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
        this.setState({ ...this.state, tempAvatarUrl: URL.createObjectURL(image) });
    };

    loadProfile() {
        requestManager.request(loadProfile, this.props.id);
    }

    #addFriend = () => {
        requestManager.request(addFriend, this.props.id);
    };

    #deleteFriend = () => {
        requestManager.request(deleteFriend, this.props.id);
    };

    setEditing(e: Event) {
        e.preventDefault();
        this.setState({ ...this.state, editing: true });
    }

    unsetEditing(e: Event) {
        e.preventDefault();
        this.setState({ editing: false, tempAvatarUrl: undefined });
    }

    submitForm = (event: SubmitEvent) => {
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
                if (!store.state.user.data || !store.state.user.currentProfile) {
                    return;
                }

                let userData: TUserLight = {
                    id: store.state.user.data.id,
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    city_name: json.body.user.city_name,
                    img: json.body.user.img,
                };

                let currentProfileData: { id: number; profile: { user: TOrganizer; friends?: TFriend[] | undefined } } =
                    {
                        id: store.state.user.currentProfile.id,
                        profile: {
                            user: {
                                id: store.state.user.currentProfile.id,
                                city_name: json.body.user.city_name,
                                name: formData.get("name") as string,
                                img: json.body.user.img,
                                phone: formData.get("phone") as string,
                                email: formData.get("email") as string,
                                website: (formData.get("website") as string) || undefined,
                            },
                        },
                    };

                store.dispatch(setUserData(userData), setCurrentProfile(currentProfileData));
            } else if (response.status === 409) {
                let errorMsgElement = document.getElementById("profile-description-error-message");
                if (errorMsgElement) {
                    errorMsgElement.textContent = json.errorMsg || null;
                }
            }
        });
        ajax.addHeaders({ "Content-Type": "application/json; charset=UTF-8" });

        this.setState({ editing: false, tempAvatarUrl: undefined });
    }

    render(): JSX.Element {
        if (kickUnauthorized(store.state.user)) {
            return <span></span>;
        }

        const getTable = (profile_data: CurrentProfileState) => {
            if (this.state.editing) {
                const cities = getCitiesNames(store.state.header);
                const city = store.state.user.currentProfile?.city_name;

                type FieldType = { title: string; name: string; value: string };
                const renderField = ({ title, name, value }: FieldType) => {
                    return [
                        <div className="table__cell grey">{title}</div>,
                        <div className="table__cell-input">
                            <input className="table__input" name={name} type="text" value={value} />
                        </div>,
                    ];
                };

                return (
                    <div className="table">
                        {renderField({ title: "Имя", name: "name", value: profile_data.name })}
                        {profile_data.email &&
                            renderField({ title: "Почта", name: "email", value: profile_data.email })}

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

                        {profile_data.phone &&
                            renderField({ title: "Телефон", name: "phone", value: profile_data.phone })}
                        {profile_data.phone &&
                            renderField({ title: "Сайт", name: "website", value: profile_data.website || "" })}
                    </div>
                );
            }

            const rows = (() => {
                let tableContents: TableContents = {
                    Имя: profile_data.name,
                    Почта: undefined,
                    Город: profile_data.city_name ? profile_data.city_name : "Москва",
                    Телефон: undefined,
                    Сайт: undefined,
                };

                if (mineProfile(store.state.user)) {
                    tableContents["Почта"] = profile_data.email || "не указана";
                } else {
                    tableContents["Почта"] = "не указана";
                }

                if (isOrganizer(store.state.user)) {
                    tableContents["Телефон"] = profile_data.phone;
                    tableContents["Сайт"] = profile_data.website;
                }

                return createTable(filterTableContents(tableContents));
            })();

            let cells = [];

            for (const row of rows) {
                cells.push(<div className="table__cell grey">{row.title}</div>);
                cells.push(<div className="table__cell">{row.value}</div>);
            }

            return <div className="table">{cells}</div>;
        };

        const user_data = store.state.user.data;
        if (!user_data) {
            return <div>Вы не авторизованы</div>;
        }

        const profile_data = store.state.user.currentProfile;

        if (!profile_data) {
            return <div>Такого пользователя не существует</div>;
        }

        const avatar = this.state.tempAvatarUrl || getUploadsImg(store.state.user.currentProfile!.img);
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
                        <input
                            type="button"
                            onClick={(e) => this.unsetEditing(toEvent(e))}
                            className="button-danger"
                            value="Отменить"
                        ></input>,
                    ];
                }

                return (
                    <input
                        type="button"
                        onClick={(e) => this.setEditing(toEvent(e))}
                        className="button"
                        value="Редактировать"
                    ></input>
                );
            }

            const isFriend = store.state.user.currentProfile?.is_friend;

            if (isFriend) {
                return (
                    <input
                        type="button"
                        onClick={() => this.#deleteFriend()}
                        className="button-danger"
                        value="Удалить из друзей"
                    ></input>
                );
            }

            return <input onClick={this.#addFriend} className="button" value="Добавить в друзья"></input>;
        };

        return (
            <div>
                <form
                    id="edit-profile-form"
                    onSubmit={(e) => this.submitForm(toSubmitEvent(e))}
                    onChange={(e) => this.#formChanged(toEvent(e))}
                    className="profile-description"
                >
                    <div className="profile-description__img-container">
                        <label htmlFor="avatar-picker" className={this.state.editing ? "form-label-img-editable" : ""}>
                            <img src={avatar} className="profile-description__img" />
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
            </div>
        );
    }
}
