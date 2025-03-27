import { MarketEvent, MarketEvents } from "./events/event.js";
import { Subscription, MarketEventDetails } from "../types.js";
import Queue from "./queue/queue.js";
export default class Market {
    id: string;
    products: Record<string, unknown>;
    defaultProducts: Record<string, unknown>;
    storage: Storage;
    queue: Queue;
    private eventListeners;
    constructor(marketId: string, defaultProducts: Record<string, unknown> | undefined, storage: Storage);
    get(product?: string): unknown;
    has(product: string): boolean;
    set(products: Record<string, unknown>): void;
    rm(...products: string[]): void;
    clear(): void;
    on(event: MarketEvents, callback: (event: CustomEvent<MarketEventDetails>) => void): void;
    subscribeElement(subscription: Subscription): void;
    unsubscribeElement(subscription: Subscription): void;
    private handleSubscription;
    protected _event(type: MarketEvents, details?: MarketEventDetails): MarketEvent<MarketEventDetails>;
    protected _save(): void;
    protected _prepare(): void;
}
//# sourceMappingURL=market.d.ts.map