/* gats.ts contains routines that are used inside Rust code to make queries
* Both functions are required as there are use cases where only blocking
* synchronous calls are possible
*/

import { blake3 as b3 } from '@noble/hashes/blake3'
import { from } from 'multiformats/hashes/hasher'
import {createVerifiedFetch, VerifiedFetch} from "@helia/verified-fetch";

export const blake3 = from({
    name: 'blake3',
    code: 0x1e,
    encode: (input) => b3(input),
})

type Header = {name: string, value: string};

let verifiedFetch: VerifiedFetch | undefined = undefined;
export function install_verified_fetch(gateways: string[]) {
    createVerifiedFetch({
        gateways: gateways,
        hashers: [blake3]
    }).then((customVerifiedFetch) => {
        verifiedFetch = customVerifiedFetch;
    })
}


function prepare_request_headers(url: string, headers_arr: Array<{name: string, value: string}>): [string, Headers] {
    let headers = new Headers(Object.fromEntries(headers_arr.map((h): [string, string] => [h.name, h.value])));
    if (headers.has("range")) {
        const range_value = headers.get("range");
        url += ("?r=" + range_value)
        if (range_value !== "0-")
        headers.set("cache-control", "no-store");
    }
    return [url, headers]
}

function parse_response_headers(headers: Headers): Header[] {
    let headers_arr: Array<{name: string, value: string}> = []
    headers.forEach((value, key) => {
        headers_arr.push({name: key, value})
    })
    return headers_arr
}


export async function request_async(method: string, url: string, headers: Array<{name: string, value: string}>) {
    const [processed_url, processed_headers] = prepare_request_headers(url, headers);
    const response = await fetch(processed_url, {
        method,
        headers: processed_headers
    })
    if (response.status >= 200 && response.status < 300) {
        return {
            data: new Uint8Array(await response.arrayBuffer()),
            headers: parse_response_headers(response.headers)
        }
    }
    throw Error(response.statusText);
}

export async function verified_request_async(method: string, url: string, headers: Array<{name: string, value: string}>) {
    const [processed_url, processed_headers] = prepare_request_headers(url, headers);
    const response = await verifiedFetch!(processed_url, {
        method,
        headers: processed_headers
    })
    if (response.status >= 200 && response.status < 300) {
        return {
            data: new Uint8Array(await response.arrayBuffer()),
            headers: parse_response_headers(response.headers)
        }
    }
    throw Error(response.statusText);
}