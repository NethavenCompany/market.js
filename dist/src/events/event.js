/**
 * Enumeration of all possible market events
 */
export var MarketEvents;
(function (MarketEvents) {
    /** Triggered before setting products */
    MarketEvents["BeforeSettingProduct"] = "beforeSettingProduct";
    /** Triggered after setting products */
    MarketEvents["AfterSettingProduct"] = "afterSettingProduct";
    /** Triggered before removing products */
    MarketEvents["BeforeRemovingProduct"] = "beforeRemovingProduct";
    /** Triggered after removing products */
    MarketEvents["AfterRemovingProduct"] = "afterRemovingProduct";
    /** Triggered before clearing the market */
    MarketEvents["BeforeClearingMarket"] = "beforeClearingMarket";
    /** Triggered after clearing the market */
    MarketEvents["AfterClearingMarket"] = "afterClearingMarket";
    /** Triggered when a product changes */
    MarketEvents["ProductChange"] = "productChange";
})(MarketEvents || (MarketEvents = {}));
/**
 * Custom event class for market events with additional metadata
 */
export class MarketEvent extends CustomEvent {
    constructor(name, details) {
        super(name, { detail: details });
        this.timestamp = Date.now();
        // Copy all properties from details to the event instance
        for (const [key, value] of Object.entries(details)) {
            // @ts-expect-error: We are assigning dynamic properties
            this[key] = value;
        }
    }
}
//# sourceMappingURL=event.js.map