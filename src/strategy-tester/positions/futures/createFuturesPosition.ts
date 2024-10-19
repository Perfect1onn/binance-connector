import { v4 } from "uuid";
import { client } from "../../index";
import { IFuturesPosition } from "./types";

export const createFuturesPosition = async (
	symbol: string,
	leverage: number,
	deposit: number
): Promise<IFuturesPosition> => {
	const futuresMarkPrice = +(await client.futures.getFuturesMarkPrice(symbol))
		.markPrice;
	const positionMarkPrice = deposit * leverage;
	const liquidation =
		(futuresMarkPrice * positionMarkPrice - leverage * deposit) /
			(positionMarkPrice + deposit) +
		200;

	return {
		id: v4(),
		symbol,
		markPrice: futuresMarkPrice,
		positionMarkPrice,
		leverage,
		deposit,
		liquidation,
		timestamp: new Date().getTime(),
	};
};