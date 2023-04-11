import config from "config";

const fixImgUrl = (url: string): string => {
    while (url.charAt(0) === "/") {
        url = url.substring(1);
    }

    return url;
};

export const getUploadsImg = (url: string) => {
    return config.UPLOADS + "/" + fixImgUrl(url);
};
