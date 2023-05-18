import { Loading } from "components/Common/Loading";
import { Table } from "components/Common/Table";
import { VDOM, Component } from "modules/vdom";

export class ProfileLoading extends Component {
    render() {
        return (
            <form id="edit-profile-form" className="profile-description">
                <div className="profile-description__img-container">
                    <label htmlFor="avatar-picker" className="">
                        <div className="profile-description__img-loading">
                            <Loading size="m" />
                        </div>
                    </label>
                </div>
                <div className="profile-description__description-block w-100">
                    <div className="profile-description__table-container">
                        <Table
                            data={[
                                { title: "Имя", value: "Loading . . ." },
                                { title: "Почта", value: "Loading . . ." },
                                { title: "Город", value: "Loading . . ." },
                            ]}
                        />
                    </div>
                </div>
            </form>
        );
    }
}
