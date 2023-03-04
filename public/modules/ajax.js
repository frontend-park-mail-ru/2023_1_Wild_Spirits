/** @module ajax */

/** class representing an asynchronous request. */
export class Ajax {
    #host = "";
    #headers = {};

    /** 
     * host address
     * @param {string} value - host address
     */
    set host(value) {
        this.#host = value;
    }

    /**
     * Add headers to request
     * @param {Object} values - headers to add
     */
    addHeaders(values) {
        this.#headers = { ...this.#headers, ...values };
    }

    /**
     * Removes header by its name
     * @param {string} key - name of the header to be removed
     */
    removeHeaders(key) {
        delete this.#headers[key];
    }

    /**
     * Transform query parameters to string
     * @param {Object} urlProps - query parameters
     * @returns {string} - query parameters string
     */
    urlPropsToString(urlProps) {
        if (!Object.keys(urlProps).length) {
            return "";
        }
        return (
            "?" +
            Object.entries(urlProps)
                .map(({ key, value }) => `${key}=${value}`)
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
     * @returns {Promise} - promise of request result
     */
    get({ url, urlProps = {}, headers = {} }) {
        return this.#ajax({ method: "GET", url, urlProps, body: {}, headers });
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
    post({ url, urlProps = {}, body = {}, headers = {}, credentials = false }) {
        return this.#ajax({ method: "POST", url, urlProps, body, headers, credentials });
    }

    async #ajax({ method, url, urlProps, body, headers, credentials = false }) {
        const response = await fetch(this.#host + url + this.urlPropsToString(urlProps), {
            method,
            mode: "cors",
            credentials: credentials ? "include" : undefined,
            body: Object.keys(body).length ? JSON.stringify(body) : undefined,
            headers: { ...this.#headers, ...headers },
        });

        const json = await response.json();

        return { json, response };
    }
}
