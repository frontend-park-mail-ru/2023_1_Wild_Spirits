import config from "config";
import { TUserBase } from "models/User";

const fixImgUrl = (url: string): string => {
    while (url.charAt(0) === "/") {
        url = url.substring(1);
    }

    return url;
};

export const getUploadsImg = (url: string) => {
    const fixedUrl = fixImgUrl(url);
    return fixedUrl === "" ? "" : config.UPLOADS + "/" + fixedUrl;
};

export const addUploadsUrl = (users: TUserBase[]) => {
    return users.map(user => ({...user, img: getUploadsImg(user.img)}));
}
