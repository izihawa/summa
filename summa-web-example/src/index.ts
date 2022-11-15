import * as Comlink from "comlink";

import { WebIndexServiceWorker } from "summa-wasm";

// IPFS hash of directory with the index of interest
const ipfs_hash = "bafyb4ih55sd6tmyz2nxvif5zb43yjhzlhcwuhrjcg2q4dtjrj3wmzeey6a";

// Directory URL that is used to access index
const directory_url = `http://localhost:8080/ipfs/${ipfs_hash}/`;

const web_index_service_worker = Comlink.wrap<WebIndexServiceWorker>(
    new Worker(
        new URL(
          "summa-wasm/dist/worker.js",
          import.meta.url
        ),
        { type: "module" }
    )
);
const index_bg_wasm = new URL(
    "../node_modules/summa-wasm/dist/index_bg.wasm",
    import.meta.url
).href
// `web_index_service_worker` is a unit used to spawn threads for searching
await web_index_service_worker.setup(index_bg_wasm, 4)

// `network_config` is a configuration object used for telling Summa how to reach remote index
const network_config = {
    method: "GET",
    url_template: `${directory_url}{file_name}`,
    headers_template: [{name: "range", value: "bytes={start}-{end}"}],
}

// `index_payload` is the payload we have stored in index when have been publishing it
const index_payload = await web_index_service_worker.add(network_config);
const omnibox = document.getElementById("omnibox");

omnibox.onkeydown = ((e) => {
    if(e.code == "Enter") {
        const index_query = {
            index_name: index_payload["name"],
            query: {query: {match: {value: (omnibox as HTMLInputElement).value}}},
            collectors: [{collector: {top_docs: {limit: 5}}}],
        }
        web_index_service_worker.search([ index_query ]).then((search_results) => {
            document.getElementById("search_result").innerText = JSON.stringify(
                search_results[0]["collector_output"]["top_docs"]["scored_documents"].map((el) => JSON.parse(el.document)["title"])
            );
        })
    }
});
