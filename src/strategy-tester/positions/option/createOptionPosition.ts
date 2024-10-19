import { v4 } from "uuid";
import { client } from "../../index";
import { IOptionPosition } from "./types";

export const createOptionPosition = async (
	symbol: string,
	indexPrice: number,
	deposit: number
): Promise<IOptionPosition> => {
	const optionMarkPrice = +(await client.eoptions.getOptionMarkPrice(symbol))[0]
		.markPrice;
	const contractQuantity = +(deposit / optionMarkPrice).toFixed(2);

	return {
		id: v4(),
		symbol: symbol,
		indexPrice,
		markPrice: optionMarkPrice,
		contractQuantity,
		deposit,
		timestamp: new Date().getTime(),
	};
};