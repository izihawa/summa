import * as Comlink from "comlink";
import { IndexRegistry } from './index-registry'

export const index_registry = new IndexRegistry();
Comlink.expose(index_registry);