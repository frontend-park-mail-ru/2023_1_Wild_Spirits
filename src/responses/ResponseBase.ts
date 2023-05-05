export interface ResponseBodyOrError<T> {
    body?: T;
    errorMsg?: string;
}

export interface ResponseBody<T> {
    body: T;
}

export interface ResponseErrorDefault {
    errorMsg?: string;
    errors?: {[key: string]: string}
}
