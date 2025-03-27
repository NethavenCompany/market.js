import { MarketEvent, MarketEvents } from "./events/event.js";

import { Subscription, MarketEventDetails } from "../types.js";
import Queue from "./queue/queue.js";

export default class Market {
	public id: string;
	public products: Record<string, unknown>;
	public defaultProducts: Record<string, unknown>;
	public storage: Storage;
	public queue: Queue;
	private eventListeners = new Map<Subscription, (event: Event) => void>();

	constructor(marketId: string, defaultProducts: Record<string, unknown> = {}, storage: Storage) {
		this.id = marketId;
		this.products = defaultProducts;
		this.defaultProducts = defaultProducts;
		this.storage = storage;
		this.queue = new Queue();
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

	set(products: Record<string, unknown>): void {
		dispatchEvent(
			this._event(MarketEvents.BeforeSettingProduct, {
				products: this.products,
				newProducts: products,
			})
		);

		this.products = { ...this.products, ...products };
		this._save();

		dispatchEvent(
			this._event(MarketEvents.AfterSettingProduct, {
				products: this.products,
				newProducts: products,
			})
		);
	}

	rm(...products: string[]): void {
		const removedProducts: Record<string, unknown> = {};

		dispatchEvent(
			this._event(MarketEvents.BeforeRemovingProduct, {
				products: this.products,
			})
		);

		products.forEach((product) => {
			removedProducts[product] = this.products[product];
			delete this.products[product];
		});
		this._save();

		dispatchEvent(
			this._event(MarketEvents.AfterRemovingProduct, {
				products: this.products,
				removedProducts,
			})
		);
	}

	clear(): void {
		dispatchEvent(
			this._event(MarketEvents.BeforeClearingMarket, {
				products: this.products,
			})
		);

		this.products = {};
		this._save();

		dispatchEvent(
			this._event(MarketEvents.AfterClearingMarket, { products: this.products })
		);
	}

	// Event handling
	// ========================

	on(event: MarketEvents, callback: (event: CustomEvent<MarketEventDetails>) => void): void {
		const eventId = `${this.id}__${event}`;
		addEventListener(eventId, callback as EventListener);
	}

	subscribeElement(subscription: Subscription): void {
		if (this.has(subscription.product)) {
			const element = subscription.element as unknown as Record<string, unknown>;
			element[subscription.attribute] = this.get(subscription.product);
		} else {
			const element = subscription.element as unknown as Record<string, unknown>;
			element[subscription.attribute] = subscription.defaultValue;
		}

		const listener = (event: Event) => this.handleSubscription(subscription, event);
		this.eventListeners.set(subscription, listener);

		subscription.element.addEventListener(subscription.event, listener);
	}

	unsubscribeElement(subscription: Subscription): void {
		const listener = this.eventListeners.get(subscription);

		if (listener) {
			subscription.element.removeEventListener(subscription.event, listener);
			this.eventListeners.delete(subscription);
		}
	}

	private handleSubscription(subscription: Subscription, evt: Event): void {
		const target = evt.target as unknown as Record<string, unknown>;
		const newProduct = target[subscription.attribute];
		const productSet: Record<string, unknown> = {};
		productSet[subscription.product] = newProduct;
		this.set(productSet);

		if (subscription.callback) {
			subscription.callback(evt, this);
		}
	}

	// Protected methods
	// ========================

	protected _event(type: MarketEvents, details: MarketEventDetails = {}): MarketEvent<MarketEventDetails> {
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
