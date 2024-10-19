export interface IFuturesPosition {
	id: string;
	symbol: string;
	markPrice: number;
	positionMarkPrice: number;
	leverage: number;
	deposit: number;
	liquidation: number;
	timestamp: number
}