import type { MarketEventDetails } from "../../types.d.ts";

/**
 * Enumeration of all possible market events
 */
export enum MarketEvents {
	/** Triggered each time the .set() method is called */
	Set = "set",
	/** Triggered each time the .remove() method is called */
	Remove = "remove",
	/** Triggered each time the .clear() method is called */
	Clear = "clear",
	/** Triggered when the market is deleted */
	Destroy = "destroy",
}

/**
 * Custom event class for market events with additional metadata
 */
export class MarketEvent<T extends MarketEventDetails> extends CustomEvent<T> {
	constructor(name: string, details: T) {
		super(name, {});

		// Copy all properties from details to the event instance
		for (const [key, value] of Object.entries(details)) {
			this[key as keyof this] = value as this[keyof this];
		}
	}
}
