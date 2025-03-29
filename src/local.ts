import Market from "./market.js";

/**
 * Creates a new LocalMarket.
 * @param marketId The unique identifier for the market.
 */
export const useLocalMarket = (
	marketId: string,
	defaultProducts: Record<string, unknown>
) => {
	const market = new Market(marketId, defaultProducts, localStorage);

	return market;
};
