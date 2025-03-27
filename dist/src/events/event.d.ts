import { MarketEventDetails } from "../../types";
/**
 * Enumeration of all possible market events
 */
export declare enum MarketEvents {
    /** Triggered before setting products */
    BeforeSettingProduct = "beforeSettingProduct",
    /** Triggered after setting products */
    AfterSettingProduct = "afterSettingProduct",
    /** Triggered before removing products */
    BeforeRemovingProduct = "beforeRemovingProduct",
    /** Triggered after removing products */
    AfterRemovingProduct = "afterRemovingProduct",
    /** Triggered before clearing the market */
    BeforeClearingMarket = "beforeClearingMarket",
    /** Triggered after clearing the market */
    AfterClearingMarket = "afterClearingMarket",
    /** Triggered when a product changes */
    ProductChange = "productChange"
}
/**
 * Custom event class for market events with additional metadata
 */
export declare class MarketEvent<T extends MarketEventDetails> extends CustomEvent<T> {
    /** Timestamp when the event was created */
    readonly timestamp: number;
    constructor(name: string, details: T);
}
//# sourceMappingURL=event.d.ts.map