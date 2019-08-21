/**
 * This is port of the library jerrybendy/url-search-params-polyfill
 * It has been converted into a JavaScript class.
 *
 * @author Eric Richer <eric.richer@vistoconsulting.com>
 * @licence MIT
*/

const __URLSearchParams__ = "__URLSearchParams__";

export class URLSearchParams {
    /**
     *
     * @param {string|null} search
     */
    constructor(search=null) {
        search = search || "";
        if (search instanceof URLSearchParams || search instanceof RNURLSearchParams) {
            search = search.toString();
        }
        this[__URLSearchParams__] = this.parseToDict(search);
    }

    /**
     * Appends a specified key/value pair as a new search parameter
     * @param {string} name
     * @param {string} value
     */
    append( name, value) {
        this.appendTo(this[__URLSearchParams__], name, value);
    };

    /**
     * Deletes this give search parameter, and its associated value, from the list of all search parameters
     * @param {string} name
     */
    delete(name) {
        delete this[__URLSearchParams__][name];
    };

    /**
     * Returns the first value associated to the given search parameter
     * @param {string} name
     * @return {string|null}
     */
    get(name) {
        const dict = this[__URLSearchParams__];
        return name in dict ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given parameter
     * @param {string} name
     * @return {Array}
     */
    getAll(name) {
        const dict = this[__URLSearchParams__];
        return name in dict ? dict[name].slice(0) : []
    };

    /**
     * Test if the search parameter exists
     * @param {string} name
     * @return {boolean}
     */
    has(name) {
        return name in this[__URLSearchParams__];
    };

    /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the others.
     * @param {string} name
     * @param {string} value
     */
    set(name, value) {
        this[__URLSearchParams__][name] = [''+value];
    };

    /**
     * Returns a string containing a query string suitable for use in a URL
     * @return {string}
     */
    toString() {
        const dict = this[__URLSearchParams__],
            query = [];
        let key, name, i, value;
        for (key in dict) {
            name = this.encode(key);
            for (i=0, value = dict[key]; i<value.length; i++) {
                query.push(name+'='+this.encode(value[i]));
            }
        }
        return query.join('&');
    };

    /**
     *
     * @param {string|object|array} search
     */
    parseToDict(search) {
        const dict = {};

        if (typeof search === 'object') {
            // if 'search' is an array, treat it as a sequence
            if (Array.isArray(search)) {
                for (let i=0; i<search.length; i++) {
                    const item = search[i];
                    if (Array.isArray(item) && item.length === 2) {
                        this.appendTo(dict, item[0], item[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initalizer must only contain pair elements");
                    }
                }
            } else {
                for (let key in search) {
                    if (search.hasOwnProperty(key)) {
                        this.appendTo(dict, key, search[key]);
                    }
                }
            }
        } else {
            // remove 1st ?
            if (search.indexOf('?') === 0) {
                search = search.slice(1);
            }

            const pairs = search.split("&");
            for (let j=0; j<pairs.length; j++) {
                const value = pairs[j],
                    index = value.indexOf('=');
                if (-1 <index) {
                    this.appendTo(dict, this.decode(value.slice(0, index)), this.decode(value.slice(index+1)));
                } else {
                    if (value) {
                        this.appendTo(dict, this.decode(value), '');
                    }
                }
            }

        }

        return dict;
    }

    appendTo(dict, name, value) {
        const val = typeof value === 'string' ? value: (
            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
        );

        if (name in dict) {
            dict[name].push(value);
        } else {
            dict[name] = [val];
        }
    }

    decode(str) {
        return str
            .replace(/[ +]/g, '%20')
            .replace(/(%[a-f0-9]{2})+/ig, (match) => {return decodeURIComponent(match)})
    }

    encode(str) {
        const replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, match => replace[match]);
    }
}
