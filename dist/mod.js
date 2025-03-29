/**
 * Enumeration of all possible market events
 */
var MarketEvents;
(function (MarketEvents) {
    /** Triggered each time the .set() method is called */
    MarketEvents["Set"] = "set";
    /** Triggered each time the .remove() method is called */
    MarketEvents["Remove"] = "remove";
    /** Triggered each time the .clear() method is called */
    MarketEvents["Clear"] = "clear";
    /** Triggered when the market is deleted */
    MarketEvents["Destroy"] = "destroy";
})(MarketEvents || (MarketEvents = {}));
/**
 * Custom event class for market events with additional metadata
 */
class MarketEvent extends CustomEvent {
    constructor(name, details) {
        super(name, {});
        // Copy all properties from details to the event instance
        for (const [key, value] of Object.entries(details)) {
            this[key] = value;
        }
    }
}

/**
 * A queue for managing asynchronous tasks
 */
class Queue {
    constructor() {
        this.tasks = [];
    }
    /**
     * Add a new task to the queue
     * @param task The task to add
     */
    push(task) {
        this.tasks.push(task);
    }
    /**
     * Cancel all tasks in the queue
     */
    cancel() {
        this.tasks = [];
    }
    /**
     * Remove a specific task from the queue
     * @param product The product identifier of the task to remove
     */
    remove(product) {
        this.tasks = this.tasks.filter(task => task.product !== product);
    }
    /**
     * Get all tasks in the queue
     * @returns Array of tasks
     */
    list() {
        return [...this.tasks];
    }
    /**
     * Execute all tasks in the queue
     * @returns Promise that resolves when all tasks are complete
     */
    async execute() {
        const tasks = [...this.tasks];
        this.tasks = [];
        await Promise.all(tasks.map(task => task.task()));
    }
}

class Market {
    constructor(marketId, defaultProducts = {}, storage) {
        this.listeners = new Map();
        this.id = marketId;
        this.products = defaultProducts;
        this.defaultProducts = defaultProducts;
        this.storage = storage;
        this.queue = new Queue();
        this._prepare();
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
    hasAll(products) {
        return Object.keys(products).every((product) => this.has(product));
    }
    set(products) {
        const oldProducts = Object.assign({}, this.products);
        const newProducts = Object.assign({}, products);
        this.products = Object.assign(Object.assign({}, this.products), products);
        this._save();
        dispatchEvent(this._event(MarketEvents.Set, {
            products: this.products,
            oldProducts,
            newProducts,
        }));
    }
    remove(...products) {
        const oldProducts = Object.assign({}, this.products);
        const removedProducts = {};
        products.forEach((product) => {
            removedProducts[product] = this.products[product];
            delete this.products[product];
        });
        this._save();
        dispatchEvent(this._event(MarketEvents.Remove, {
            products: this.products,
            oldProducts,
            removedProducts,
        }));
    }
    clear() {
        const oldProducts = Object.assign({}, this.products);
        this.products = {};
        this._save();
        dispatchEvent(this._event(MarketEvents.Clear, {
            products: this.products,
            oldProducts,
        }));
    }
    destroy() {
        this.listeners.forEach((_listener, subscription) => {
            this.unsubscribeElement(subscription);
        });
        this.listeners.clear();
        this.storage.removeItem(this.id);
        dispatchEvent(this._event(MarketEvents.Destroy, {
            products: this.products,
        }));
    }
    // Event handling
    // ========================
    on(event, callback) {
        const eventId = `${this.id}__${event}`;
        addEventListener(eventId, (event) => {
            callback(event, this);
        });
    }
    subscribeElement(subscription) {
        const listener = (event) => this._handleSubscription(subscription, event);
        this.listeners.set(subscription, listener);
        subscription.element.addEventListener(subscription.event, listener);
    }
    unsubscribeElement(subscription) {
        const listener = this.listeners.get(subscription);
        if (listener) {
            subscription.element.removeEventListener(subscription.event, listener);
            this.listeners.delete(subscription);
        }
    }
    // Protected methods
    // ========================
    _handleSubscription(subscription, event) {
        const target = event.target;
        const newProduct = target[subscription.attribute];
        const productSet = {};
        productSet[subscription.product] = newProduct;
        this.set(productSet);
        if (subscription.callback) {
            subscription.callback(event, this);
        }
    }
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

/**
 * Creates a new LocalMarket.
 * @param marketId The unique identifier for the market.
 */
const useLocalMarket = (marketId, defaultProducts) => {
    const market = new Market(marketId, defaultProducts, localStorage);
    return market;
};

/**
 * Creates a new SessionMarket.
 * @param marketId The unique identifier for the market.
 */
const useSessionMarket = (marketId, defaultProducts) => {
    const market = new Market(marketId, defaultProducts, sessionStorage);
    return market;
};

export { useLocalMarket, useSessionMarket };
//# sourceMappingURL=mod.js.map
