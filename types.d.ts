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
	/** Optional callback function called after the market is updated */
	callback?: (event: Event, market: Market) => void;
}

/**
 * Valid properties that can be included in market event details
 */
type EventDetailProperty =
	| "products"
	| "removedProducts"
	| "message"
	| "newProducts";

/**
 * Type for market event details with specific property types
 */
interface MarketEventDetails {
	/** Current products in the market */
	products?: Record<string, unknown>;
	/** Products that were removed */
	removedProducts?: Record<string, unknown>;
	/** Optional message associated with the event */
	message?: string;
	/** New products being set */
	newProducts?: Record<string, unknown>;
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