export class Ajax {
    #host = "";
    #headers = {};

    set host(value) {
        this.#host = value;
    }

    addHeaders(values) {
        this.#headers = { ...this.#headers, ...values };
    }

    removeHeaders(key) {
        delete this.#headers[key];
    }

    urlPropsToString(urlProps) {
        if (!urlProps) {
            return "";
        }
        return (
            "?" +
            Object.entries(urlProps)
                .map(({ key, value }) => `${key}=${value}`)
                .join("&")
        );
    }

    get({ url, urlProps = [], headers = {} }) {
        return this.#ajax({ method: "GET", url, urlProps, body: {}, headers });
    }

    post({ url, urlProps = [], body = {}, headers = {} }) {
        return this.#ajax({ method: "POST", url, urlProps, body, headers });
    }

    async #ajax({ method, url, urlProps, body, headers }) {
        const response = await fetch(this.#host + url + this.urlPropsToString(urlProps), {
            method,
            mode: "cors",
            body: JSON.stringify(body),
            headers: { ...this.#headers, ...headers },
        });

        const json = await response.json();

        return { json, response };
    }
}
