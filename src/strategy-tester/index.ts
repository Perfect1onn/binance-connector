import { config } from "dotenv";
config();

import { v4 } from "uuid";
import { WebSocket } from "ws";
import { Connector } from "../binance-connector/index";
import { IPostitionResult } from "./types";
import {
	createFuturesPosition,
	createOptionPosition,
	findOptionStrikes,
	getExpirationTime,
	getNextHour,
	IFuturesPosition,
	IOptionPosition,
} from "./positions";
import mongoose from "mongoose";
import BitcoinMarkPriceSchema from "./positions/BitcoinMarkPriceSchema";

export const client = new Connector({
	options: {
		apiKey: process.env.API_KEY,
	},
	modules: [
		{
			URL: process.env.BINANCE_OPTIONS_URL,
			variant: "eoptions",
			webSocketURL: process.env.BINANCE_OPTIONS_WEBSOCKET_URL,
		},
		{
			URL: process.env.BINANCE_FUTURES_URL,
			variant: "futures",
			webSocketURL: process.env.BINANCE_FUTURES_WEBSOCKET_URL,
		},
	],
});

const TEN_MINUTES_IN_MILLISECONDS = 600000;

const wss = new WebSocket.Server({
	port: 9999,
});

const app = async () => {
	const expirationData = getExpirationTime();
	let postionsCreationTimeout = false;
	let optionPosition: IOptionPosition | null = null;
	let futuresPosition: IFuturesPosition | null = null;
	const positionsResults: IPostitionResult = {
		eoptions: null,
		futures: null,
	};
	
	await mongoose.connect(process.env.DB_URL);

	client.eoptions.connectIndexPriceStream("BTCUSDT", {
		onMessageHandler: async (indexPrice) => {
			const { expirationDate, expirationTime } = expirationData;
			const currentIndexPrice = +indexPrice.p;
			const currentTime = new Date().getTime();

			if (expirationTime < currentTime) {
				const { expirationDate, expirationTime } = getExpirationTime();
				expirationData.expirationDate = expirationDate;
				expirationData.expirationTime = expirationTime;
				console.log("NEW TIME:", expirationTime);
				return;
			}

			const differanceTime =
				new Date(2024, 9, 19, 17, 41).getTime() - currentTime; // 12:00

			if (
				differanceTime >= TEN_MINUTES_IN_MILLISECONDS &&
				differanceTime <= TEN_MINUTES_IN_MILLISECONDS + 3000 &&
				!postionsCreationTimeout
			) {
				postionsCreationTimeout = true;
				const optionsStrikes = await findOptionStrikes(
					"BTC",
					expirationDate,
					currentIndexPrice
				);

				optionPosition = await createOptionPosition(
					`BTC-${expirationDate}-${optionsStrikes[0]}-P`,
					currentIndexPrice,
					71
				);
				futuresPosition = await createFuturesPosition("BTCUSDT", 75, 100);

				setTimeout(() => {
					postionsCreationTimeout = false;
				}, 3000);
				console.log("OPTION POSITION CREATED", optionPosition);
				console.log("FUTURES POSITION CREATED", futuresPosition);
			}

			if (optionPosition && !postionsCreationTimeout) {
				const { symbol, contractQuantity, deposit } = optionPosition;
				const strike = +symbol.split("-")[2];
				const profit =
					(strike - currentIndexPrice) * contractQuantity - deposit;
				const pnl = (profit * 100) / deposit;

				positionsResults.eoptions = {
					...optionPosition,
					id: v4(),
					entryMarkPrice: optionPosition.markPrice,
					positionId: optionPosition.id,
					indexPrice: currentIndexPrice,
					profit,
					pnl,
					timestamp: new Date().getTime(),
				};
			}
		},
	});

	let nextHour = getNextHour();
	console.log(nextHour);
	client.futures.connectMarkPriceStream("btcusdt", {
		onMessageHandler: async (ticker) => {
			const markPrice = +ticker.p;

			const currentTime = new Date().getTime();
			if (currentTime >= nextHour) {
				nextHour = getNextHour();
				const btcPrice = await BitcoinMarkPriceSchema.create({
					markPrice,
					timeStamp: new Date().getTime(),
				});
				console.log(btcPrice);
			}

			if (futuresPosition) {
				const entryMarkPrice = futuresPosition.markPrice;
				const pnl = ((markPrice - entryMarkPrice) * 100) / entryMarkPrice;
				const profit = (futuresPosition.positionMarkPrice * pnl) / 100;

				positionsResults.futures = {
					...futuresPosition,
					id: v4(),
					positionId: futuresPosition.id,
					currentMarkPrice: markPrice,
					pnl,
					profit,
					deposit: futuresPosition.deposit + profit,
					timestamp: new Date().getTime(),
				};
			}

			if (positionsResults.eoptions && positionsResults.futures) {
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(positionsResults));
					}
				});
			}
		},
	});
};

app();
