export interface IOptionMarkPrice {
	symbol: string;
	markPrice: string;
	bidIV: string;
	askIV: string;
	markIV: string;
	delta: string;
	theta: string;
	gamma: string;
	vega: string;
	highPriceLimit: string;
	lowPriceLimit: string;
	riskFreeInterest: string;
}

export interface IOpenInterest {
	symbol: string;
	sumOpenInterest: string;
	sumOpenInterestUsd: string;
	timestamp: string;
}

export interface ISymbolIndexPrice {
	time: number;
	indexPrice: string;
}

export interface IExchangeInformation {
	timezone: string;
	serverTime: number;
	optionContracts: {
		id: number;
		baseAsset: string;
		quoteAsset: string;
		underlying: string;
		settleAsset: string;
	}[];
	optionAssets: {
		id: number;
		name: string;
	}[];
	optionSymbols: {
		contractId: number;
		expiryDate: number;
		filters: {
			filterType: string;
			minPrice?: string;
			maxPrice?: string;
			tickSize?: string;
			minQty?: string;
			maxQty?: string;
			stepSize?: string;
		}[];
		id: number;
		symbol: string;
		side: "CALL" | "PUT";
		strikePrice: string;
		underlying: string;
		unit: number;
		makerFeeRate: string;
		takerFeeRate: string;
		minQty: string;
		maxQty: string;
		initialMargin: string;
		maintenanceMargin: string;
		minInitialMargin: string;
		minMaintenanceMargin: string;
		priceScale: number;
		quantityScale: number;
		quoteAsset: string;
	}[];
	rateLimits: {
		rateLimitType: string;
		interval: string;
		intervalNum: number;
		limit: number;
	}[];
}

export interface IWSIndexPrice {
	e: "index";
	E: number;
	s: string;
	p: string;
}

export interface IWSMarkPrice {
	e: string; // Event Type
	E: number; // Event time
	s: string; // Symbol
	mp: string; // Option mark price
}

export interface IWSTicker {
	e: string; // event type
	E: number; // event time (timestamp)
	T: number; // transaction time (timestamp)
	s: string; // Option symbol
	o: string; // 24-hour opening price
	h: string; // Highest price
	l: string; // Lowest price
	c: string; // latest price
	V: string; // Trading volume (in contracts)
	A: string; // trade amount (in quote asset)
	P: string; // price change percent
	p: string; // price change
	Q: string; // volume of last completed trade (in contracts)
	F: number; // first trade ID
	L: number; // last trade ID
	n: number; // number of trades
	bo: string; // The best buy price
	ao: string; // The best sell price
	bq: string; // The best buy quantity
	aq: string; // The best sell quantity
	b: string; // Buy Implied volatility
	a: string; // Sell Implied volatility
	d: string; // delta
	t: string; // theta
	g: string; // gamma
	v: string; // vega
	vo: string; // Implied volatility
	mp: string; // Mark price
	hl: string; // Buy Maximum price
	ll: string; // Sell Minimum price
	eep: string; // Estimated strike price
}
