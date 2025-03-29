import type { Subscription, MarketEventDetails } from "../types.d.ts";
import { MarketEvent, MarketEvents } from "./events/event.js";
import Queue from "./queue/queue.js";
export default class Market {
    id: string;
    products: Record<string, unknown>;
    defaultProducts: Record<string, unknown>;
    storage: Storage;
    queue: Queue;
    private listeners;
    constructor(marketId: string, defaultProducts: Record<string, unknown> | undefined, storage: Storage);
    get(product?: string): unknown;
    has(product: string): boolean;
    hasAll(products: Record<string, unknown>): boolean;
    set(products: Record<string, unknown>): void;
    remove(...products: string[]): void;
    clear(): void;
    destroy(): void;
    on(event: MarketEvents, callback: (event: CustomEvent<MarketEventDetails>, market: Market) => void): void;
    subscribeElement(subscription: Subscription): void;
    unsubscribeElement(subscription: Subscription): void;
    private _handleSubscription;
    protected _event(type: MarketEvents, details?: MarketEventDetails): MarketEvent<MarketEventDetails>;
    protected _save(): void;
    protected _prepare(): void;
}
//# sourceMappingURL=market.d.ts.map