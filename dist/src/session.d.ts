import Market from "./market.js";
/**
 * Represents a storage container for storing and retrieving data from sessionStorage.
 */
declare class SessionMarket extends Market {
    constructor(marketId: string, defaultProducts?: {});
}
/**
 * Creates a new SessionMarket.
 * @param marketId The unique identifier for the store.
 */
export declare const useSessionMarket: (marketId: string, defaultProducts: Record<string, unknown>) => SessionMarket;
export {};
//# sourceMappingURL=session.d.ts.map