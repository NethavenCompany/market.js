import Market from "./market.js";

/**
 * Represents a storage container for storing and retrieving data from sessionStorage.
 */
class SessionMarket extends Market {
	constructor(marketId: string, defaultProducts = {}) {
		super(marketId, defaultProducts, sessionStorage);
		this._prepare();
	}
}

/**
 * Creates a new SessionMarket.
 * @param marketId The unique identifier for the store.
 */
export const useSessionMarket = (
	marketId: string,
	defaultProducts: Record<string, unknown>
) => {
	const store = new SessionMarket(marketId, defaultProducts);

	return store;
};
