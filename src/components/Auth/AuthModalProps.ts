import { TUserAvailable } from "models/User";

export type SetUserDataProps = {
    userData: TUserAvailable;
    needRerender?: boolean;
};
export type SetUserDataFunc = ({ userData, needRerender = true }: SetUserDataProps) => void;

export type EscapeModalFunc = () => void;

export type RedirectTo = () => void;
