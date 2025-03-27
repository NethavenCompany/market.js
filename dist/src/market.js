import { MarketEvent, MarketEvents } from "./events/event.js";
import Queue from "./queue/queue.js";
export default class Market {
    constructor(marketId, defaultProducts = {}, storage) {
        this.eventListeners = new Map();
        this.id = marketId;
        this.products = defaultProducts;
        this.defaultProducts = defaultProducts;
        this.storage = storage;
        this.queue = new Queue();
    }
    // Storage methods
    // ========================
    get(product) {
        if (product) {
            return this.products[product];
        }
        return this.products;
    }
    has(product) {
        return product in this.products;
    }
    set(products) {
        dispatchEvent(this._event(MarketEvents.BeforeSettingProduct, {
            products: this.products,
            newProducts: products,
        }));
        this.products = Object.assign(Object.assign({}, this.products), products);
        this._save();
        dispatchEvent(this._event(MarketEvents.AfterSettingProduct, {
            products: this.products,
            newProducts: products,
        }));
    }
    rm(...products) {
        const removedProducts = {};
        dispatchEvent(this._event(MarketEvents.BeforeRemovingProduct, {
            products: this.products,
        }));
        products.forEach((product) => {
            removedProducts[product] = this.products[product];
            delete this.products[product];
        });
        this._save();
        dispatchEvent(this._event(MarketEvents.AfterRemovingProduct, {
            products: this.products,
            removedProducts,
        }));
    }
    clear() {
        dispatchEvent(this._event(MarketEvents.BeforeClearingMarket, {
            products: this.products,
        }));
        this.products = {};
        this._save();
        dispatchEvent(this._event(MarketEvents.AfterClearingMarket, { products: this.products }));
    }
    // Event handling
    // ========================
    on(event, callback) {
        const eventId = `${this.id}__${event}`;
        addEventListener(eventId, callback);
    }
    subscribeElement(subscription) {
        if (this.has(subscription.product)) {
            const element = subscription.element;
            element[subscription.attribute] = this.get(subscription.product);
        }
        else {
            const element = subscription.element;
            element[subscription.attribute] = subscription.defaultValue;
        }
        const listener = (event) => this.handleSubscription(subscription, event);
        this.eventListeners.set(subscription, listener);
        subscription.element.addEventListener(subscription.event, listener);
    }
    unsubscribeElement(subscription) {
        const listener = this.eventListeners.get(subscription);
        if (listener) {
            subscription.element.removeEventListener(subscription.event, listener);
            this.eventListeners.delete(subscription);
        }
    }
    handleSubscription(subscription, evt) {
        const target = evt.target;
        const newProduct = target[subscription.attribute];
        const productSet = {};
        productSet[subscription.product] = newProduct;
        this.set(productSet);
        if (subscription.callback) {
            subscription.callback(evt, this);
        }
    }
    // Protected methods
    // ========================
    _event(type, details = {}) {
        const eventId = `${this.id}__${type}`;
        return new MarketEvent(eventId, details);
    }
    _save() {
        this.storage.setItem(this.id, JSON.stringify(this.products));
    }
    _prepare() {
        const storedData = this.storage.getItem(this.id);
        if (storedData) {
            this.products = Object.assign(Object.assign({}, this.products), JSON.parse(storedData));
        }
        this._save();
    }
}
//# sourceMappingURL=market.js.map