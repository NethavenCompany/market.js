import Market from "./market.js";
/**
 * Represents a storage container for storing and retrieving data localStorage.
 */
declare class LocalMarket extends Market {
    constructor(marketId: string, defaultProducts?: {});
}
/**
 * Creates a new LocalMarket.
 * @param marketId The unique identifier for the store.
 */
export declare const useLocalMarket: (marketId: string, defaultProducts: Record<string, unknown>) => LocalMarket;
export {};
//# sourceMappingURL=local.d.ts.map