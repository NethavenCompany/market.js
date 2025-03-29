import Market from "./market.js";

/**
 * Creates a new SessionMarket.
 * @param marketId The unique identifier for the market.
 */
export const useSessionMarket = (
	marketId: string,
	defaultProducts: Record<string, unknown>
) => {
	const market = new Market(marketId, defaultProducts, sessionStorage);

	return market;
};
