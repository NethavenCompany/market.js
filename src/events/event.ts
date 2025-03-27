import { MarketEventDetails } from "../../types";

/**
 * Enumeration of all possible market events
 */
export enum MarketEvents {
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
	ProductChange = "productChange",
}

/**
 * Custom event class for market events with additional metadata
 */
export class MarketEvent<T extends MarketEventDetails> extends CustomEvent<T> {
	/** Timestamp when the event was created */
	readonly timestamp: number;

	constructor(name: string, details: T) {
		super(name, { detail: details });
		this.timestamp = Date.now();

		// Copy all properties from details to the event instance
		for (const [key, value] of Object.entries(details)) {
			// @ts-expect-error: We are assigning dynamic properties
			this[key] = value;
		}
	}
}
