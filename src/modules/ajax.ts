/** @module ajax */

type HeadersType = Record<string, string>;
export type UrlPropsType = Record<string, string | string[]>;

interface AjaxProps {
    url: string;
    urlProps?: UrlPropsType;
    body?: any;
    headers?: HeadersType;
    credentials?: boolean;
}

interface AjaxResult<T> {
    json: T;
    response: Response;
}

export namespace AjaxResultStatus {
    export const SUCCESS = "SUCCESS";
    export const ERROR = "ERROR";

    export type Type = typeof SUCCESS | typeof ERROR;
}

interface AjaxResultTest<T, R extends AjaxResultStatus.Type> {
    json: T;
    response: Response;
    status: R;
}

type AjaxPromise<T, E> = Promise<
    AjaxResultTest<T, typeof AjaxResultStatus.SUCCESS> | AjaxResultTest<E, typeof AjaxResultStatus.ERROR>
>;

export namespace AjaxMethod {
    export const GET = "GET";
    export const POST = "POST";
    export const DELETE = "DELETE";
    export const PUT = "PUT";
    export const PATCH = "PATCH";
    export type MethodType = typeof GET | typeof POST | typeof DELETE | typeof PUT | typeof PATCH;
}
/** class representing an asynchronous request. */
class Ajax {
    #host: string = "";
    #headers: HeadersType = {};

    /**
     * host address
     * @param {string} value - host address
     */
    set host(value: string) {
        this.#host = value;
    }

    /**
     * Add headers to request
     * @param {Object} values - headers to add
     */
    addHeaders(values: HeadersType) {
        this.#headers = { ...this.#headers, ...values };
    }

    /**
     * Removes header by its name
     * @param {string} key - name of the header to be removed
     */
    removeHeaders(key: string) {
        delete this.#headers[key];
    }

    /**
     * Transform query parameters to string
     * @param {Object} urlProps - query parameters
     * @returns {string} - query parameters string
     */
    urlPropsToString(urlProps: UrlPropsType | undefined): string {
        if (!urlProps || Object.keys(urlProps).length === 0) {
            return "";
        }
        return (
            "?" +
            Object.entries(urlProps)
                .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map((innerValue) => `${key}=${encodeURIComponent(innerValue)}`).join("&");
                    }
                    return `${key}=${encodeURIComponent(value)}`;
                })
                .join("&")
        );
    }

    /**
     * sends a 'GET' request
     * @param {Object} options - request options
     * @param {string} options.url - relative url of request
     * @param {Object} options.urlProps - query parameters
     * @param {string} options.body - body of the request
     * @param {Object} options.headers - request headers
     * @param {boolean} options.credentials - if to include crendentials
     * @returns {Promise} - promise of request result
     */
    get<T, E = any>(props: AjaxProps): AjaxPromise<T, E> {
        return this.#ajax<T, E>(AjaxMethod.GET, props);
    }

    /**
     * sends a 'POST' request
     * @param {Object} options - request options
     * @param {string} options.url - relative url of request
     * @param {Object} options.urlProps - query parameters
     * @param {string} options.body - body of the request
     * @param {Object} options.headers - request headers
     * @param {boolean} options.credentials - if to include crendentials
     * @returns {Promise} - promise of request result
     */
    post<T, E = any>(props: AjaxProps): AjaxPromise<T, E> {
        return this.#ajax<T, E>(AjaxMethod.POST, props);
    }

    /**
     * sends a 'PATCH' request
     * @param {Object} options - request options
     * @param {string} options.url - relative url of request
     * @param {Object} options.urlProps - query parameters
     * @param {string} options.body - body of the request
     * @param {Object} options.headers - request headers
     * @param {boolean} options.credentials - if to include crendentials
     * @returns {Promise} - promise of request result
     */
    patch<T, E = any>(props: AjaxProps): AjaxPromise<T, E> {
        return this.#ajax<T, E>(AjaxMethod.PATCH, props);
    }

    /**
     * sends a 'PATCH' request
     * @param {Object} options - request options
     * @param {string} options.url - relative url of request
     * @param {Object} options.urlProps - query parameters
     * @param {string} options.body - body of the request
     * @param {Object} options.headers - request headers
     * @param {boolean} options.credentials - if to include crendentials
     * @returns {Promise} - promise of request result
     */
    delete<T, E = any>(props: AjaxProps): AjaxPromise<T, E> {
        return this.#ajax<T, E>(AjaxMethod.DELETE, props);
    }

    async #ajax<T, E = any>(
        method: AjaxMethod.MethodType,
        { url, urlProps, body = {}, headers = {}, credentials = false }: AjaxProps
    ): AjaxPromise<T, E> {
        const bodyFix =
            body instanceof FormData ? body : Object.keys(body).length > 0 ? JSON.stringify(body) : undefined;
        const response = await fetch(this.#host + url + this.urlPropsToString(urlProps), {
            method,
            mode: "cors",
            credentials: credentials ? "include" : undefined,
            body: bodyFix,
            headers: { ...this.#headers, ...headers },
        });

        const json = await response.json();

        if (response.ok) {
            return { json: json as T, response, status: AjaxResultStatus.SUCCESS };
        }
        return { json: json as E, response, status: AjaxResultStatus.ERROR };
    }
}

export let ajax = new Ajax();
