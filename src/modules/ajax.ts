/** @module ajax */

type HeadersType = Record<string, string>;
export type UrlPropsType = Record<string, string>;

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
                .map(([key, value]) => `${key}=${value}`)
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
    get<T>(props: AjaxProps): Promise<AjaxResult<T>> {
        return this.#ajax<T>(AjaxMethod.GET, props);
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
    post<T>(props: AjaxProps): Promise<AjaxResult<T>> {
        return this.#ajax<T>(AjaxMethod.POST, props);
    }

    async #ajax<T>(
        method: AjaxMethod.MethodType,
        { url, urlProps, body = {}, headers = {}, credentials = false }: AjaxProps
    ): Promise<AjaxResult<T>> {
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

        return { json, response };
    }
}

export let ajax = new Ajax();
