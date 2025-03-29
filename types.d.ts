import Market from "./src/market";

/**
 * Represents a subscription for an HTML element to sync with market data
 */
interface Subscription {
	/** The HTML element to subscribe to */
	element: HTMLElement;
	/** The market product key to sync with */
	product: string;
	/** The DOM event type to listen for */
	event: keyof HTMLElementEventMap;
	/** The element attribute to sync with the market */
	attribute: string;
	/** The default value to set if the market product is not found */
	defaultValue?: unknown;
	/** Optional callback function called after the market is updated */
	callback?: (event: Event, market: Market) => void;
}

/**
 * Type for market event details with specific property types
 */
interface MarketEventDetails {
	/** The market instance */
	market?: Market;
	/** Current products in the market */
	products?: Record<string, unknown>;
	/** Products that were removed */
	removedProducts?: Record<string, unknown>;
	/** Optional message associated with the event */
	message?: string;
	/** New products being set */
	newProducts?: Record<string, unknown>;
	/** Old products before being set */
	oldProducts?: Record<string, unknown>;
}

/**
 * Represents a task to be executed in the queue
 */
export interface Task {
	/** The async function to execute */
	task: () => Promise<unknown>;
	/** The market product associated with this task */
	product: string;
}