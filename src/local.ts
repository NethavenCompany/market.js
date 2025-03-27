import Market from "./market.js";

/**
 * Represents a storage container for storing and retrieving data localStorage.
 */
class LocalMarket extends Market {
	constructor(marketId: string, defaultProducts = {}) {
		super(marketId, defaultProducts, localStorage);
		this._prepare();
	}
}

/**
 * Creates a new LocalMarket.
 * @param marketId The unique identifier for the store.
 */
export const useLocalMarket = (
	marketId: string,
	defaultProducts: Record<string, unknown>
) => {
	const store = new LocalMarket(marketId, defaultProducts);

	return store;
};
