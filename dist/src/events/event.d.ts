import type { MarketEventDetails } from "../../types.d.ts";
/**
 * Enumeration of all possible market events
 */
export declare enum MarketEvents {
    /** Triggered each time the .set() method is called */
    Set = "set",
    /** Triggered each time the .remove() method is called */
    Remove = "remove",
    /** Triggered each time the .clear() method is called */
    Clear = "clear",
    /** Triggered when the market is deleted */
    Destroy = "destroy"
}
/**
 * Custom event class for market events with additional metadata
 */
export declare class MarketEvent<T extends MarketEventDetails> extends CustomEvent<T> {
    constructor(name: string, details: T);
}
//# sourceMappingURL=event.d.ts.map