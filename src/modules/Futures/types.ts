export interface IWSMarkPrice {
	e: string; // Event type
	E: number; // Event time
	s: string; // Symbol
	p: string; // Mark price
	i: string; // Index price
	P: number; // Estimated Settle Price, only useful in the last hour before the settlement starts
	r: string; // Funding rate
	T: number; // Next funding time
}

export interface IFuturesMarkPrice {
	symbol: string;
	markPrice: string; // mark price
	indexPrice: string; // index price
	estimatedSettlePrice: string; // Estimated Settle Price, only useful in the last hour before the settlement starts.
	lastFundingRate: string; // This is the Latest funding rate
	nextFundingTime: number;
	interestRate: string;
	time: number;
}
