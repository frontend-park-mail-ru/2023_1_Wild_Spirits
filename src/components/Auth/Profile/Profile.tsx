/** @module Components */

import { VDOM, Component } from "modules/vdom";

import { createTable, filterTableContents, TableContents } from "components/Common/CreateTable";
import { store } from "flux";
import { kickUnauthorized, isOrganizer, CurrentProfileState, isAuthorizedOrNotDone } from "flux/slices/userSlice";

import { getCitiesNames } from "flux/slices/headerSlice";

import { addFriend, deleteFriend, loadProfile, patchProfile } from "requests/user";
import { toWebP } from "modules/imgConverter";
import { getUploadsImg } from "modules/getUploadsImg";
import { requestManager } from "requests";
import { toEvent, toSubmitEvent } from "modules/CastEvents";

import { mineProfile } from "flux/slices/userSlice";
import { LoadStatus } from "requests/LoadStatus";
import { ProfileLoading } from "./ProfileLoading";

/**
 * Profile component
 * @class
 * @extends Component
 */
export class Profile extends Component<{ id: number }, { editing: boolean; tempAvatarUrl: string | undefined }> {
    #tempAvatarUrl: string | undefined;
    #errorMsg: string;

    constructor(props: { id: number }) {
        super(props);
        this.state = { editing: false, tempAvatarUrl: undefined };
        this.#errorMsg = "";

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
        const input = event.target as HTMLInputElement;

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
        const friendState = store.state.user.currentProfile;
        if (friendState) {
            requestManager.request(addFriend, friendState);
        }
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

        const { authorized } = store.state.user;
        if (!isAuthorizedOrNotDone(authorized)) {
            return;
        }
        const userData = authorized.data;

        const formData = new FormData(form as HTMLFormElement);
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
        requestManager.request(patchProfile, user_id, formData);

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
                        <div className="table__cell-title">{title}</div>,
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

                        <div className="table__cell-title">Город</div>
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
                const tableContents: TableContents = {
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

            const cells = [];

            for (const row of rows) {
                cells.push(<div className="table__cell-title">{row.title}</div>);
                cells.push(<div className="table__cell">{row.value}</div>);
            }

            return <div className="table">{cells}</div>;
        };

        const { authorized } = store.state.user;

        // TODO check load status of authorized and currentProfile
        if (authorized.loadStatus !== LoadStatus.DONE) {
            return (
                <div className="w-100">
                    <ProfileLoading />
                </div>
            );
        }

        const profile_data = store.state.user.currentProfile;

        if (!profile_data) {
            return (
                <div className="w-100">
                    <ProfileLoading />
                </div>
            );
        }

        const avatar = this.state.tempAvatarUrl || getUploadsImg(profile_data.img);
        const table = getTable(profile_data);

        const profileBtn = () => {
            const mine = mineProfile(store.state.user);

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
                        value="Отписаться"
                    ></input>
                );
            }

            return <input onClick={this.#addFriend} className="button" value="Подписаться"></input>;
        };

        return (
            <div className="w-100">
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
                    <div className="profile-description__description-block w-100">
                        <div className="profile-description__table-container">{table}</div>
                        <div className="profile-description__button-block">{profileBtn()}</div>
                    </div>
                </form>
            </div>
        );
    }
}
