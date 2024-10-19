import { client } from "../../index";

export const findOptionStrikes = async (
	symbol: string,
	expirationDate: string,
	indexPrice: number
) => {
	const result: number[] = [];

	const options = await client.eoptions.getOpenInterest(symbol, expirationDate);
	options.forEach((option) => {
		const [symbol, expirationDate, strike, optionType] =
			option.symbol.split("-");
		if (+strike > indexPrice && optionType === "P") result.push(+strike);
	});

	return result.sort();
};
