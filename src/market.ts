import type { Subscription, MarketEventDetails } from "../types.d.ts";
import { MarketEvent, MarketEvents } from "./events/event.js";
import Queue from "./queue/queue.js";

export default class Market {
	public id: string;
	public products: Record<string, unknown>;
	public defaultProducts: Record<string, unknown>;
	public storage: Storage;
	public queue: Queue;
	private listeners = new Map<Subscription, (event: Event) => void>();

	constructor(
		marketId: string,
		defaultProducts: Record<string, unknown> = {},
		storage: Storage
	) {
		this.id = marketId;
		this.products = defaultProducts;
		this.defaultProducts = defaultProducts;
		this.storage = storage;
		this.queue = new Queue();

		this._prepare();
	}

	// Storage methods
	// ========================

	get(product?: string): unknown {
		if (product) {
			return this.products[product];
		}

		return this.products;
	}

	has(product: string): boolean {
		return product in this.products;
	}

	hasAll(products: Record<string, unknown>): boolean {
		return Object.keys(products).every((product) => this.has(product));
	}

	set(products: Record<string, unknown>): void {
		const oldProducts = { ...this.products };
		const newProducts = { ...products };

		this.products = { ...this.products, ...products };
		this._save();

		dispatchEvent(
			this._event(MarketEvents.Set, {
				products: this.products,
				oldProducts,
				newProducts,
			})
		);
	}

	remove(...products: string[]): void {
		const oldProducts = { ...this.products };
		const removedProducts: Record<string, unknown> = {};

		products.forEach((product) => {
			removedProducts[product] = this.products[product];
			delete this.products[product];
		});
		this._save();

		dispatchEvent(
			this._event(MarketEvents.Remove, {
				products: this.products,
				oldProducts,
				removedProducts,
			})
		);
	}

	clear(): void {
		const oldProducts = { ...this.products };

		this.products = {};
		this._save();

		dispatchEvent(
			this._event(MarketEvents.Clear, {
				products: this.products,
				oldProducts,
			})
		);
	}

	destroy(): void {
		this.listeners.forEach((_listener, subscription) => {
			this.unsubscribeElement(subscription);
		});

		this.listeners.clear();

		this.storage.removeItem(this.id);

		dispatchEvent(
			this._event(MarketEvents.Destroy, {
				products: this.products,
			})
		);
	}

	// Event handling
	// ========================

	on(
		event: MarketEvents,
		callback: (event: CustomEvent<MarketEventDetails>, market: Market) => void
	): void {
		const eventId = `${this.id}__${event}`;
		addEventListener(eventId, (event: Event) => {
			callback(event as CustomEvent<MarketEventDetails>, this);
		});
	}

	subscribeElement(subscription: Subscription): void {
		const listener = (event: Event) =>
			this._handleSubscription(subscription, event);
		this.listeners.set(subscription, listener);

		subscription.element.addEventListener(subscription.event, listener);
	}

	unsubscribeElement(subscription: Subscription): void {
		const listener = this.listeners.get(subscription);

		if (listener) {
			subscription.element.removeEventListener(subscription.event, listener);
			this.listeners.delete(subscription);
		}
	}

	// Protected methods
	// ========================

	private _handleSubscription(subscription: Subscription, event: Event): void {
		const target = event.target as unknown as Record<string, unknown>;
		const newProduct = target[subscription.attribute];

		const productSet: Record<string, unknown> = {};
		productSet[subscription.product] = newProduct;

		this.set(productSet);

		if (subscription.callback) {
			subscription.callback(event, this);
		}
	}

	protected _event(
		type: MarketEvents,
		details: MarketEventDetails = {}
	): MarketEvent<MarketEventDetails> {
		const eventId = `${this.id}__${type}`;
		return new MarketEvent<MarketEventDetails>(eventId, details);
	}

	protected _save(): void {
		this.storage.setItem(this.id, JSON.stringify(this.products));
	}

	protected _prepare(): void {
		const storedData = this.storage.getItem(this.id);

		if (storedData) {
			this.products = { ...this.products, ...JSON.parse(storedData) };
		}

		this._save();
	}
}
