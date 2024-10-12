import { IWebSocketProps } from "@/types";
import { Routes } from "../DecoratorFetch";
import { WebSocket } from "ws";
import { IFuturesMarkPrice, IWSMarkPrice } from "./types";

export class Fututes {
	private routes: Routes;
	private websocketURL: string | undefined;

	constructor(routes: Routes, websocketURL?: string) {
		this.routes = routes;
		this.websocketURL = websocketURL;
	}

	async getFuturesMarkPrice(symbol: string){
		const uri = `/fapi/v1/premiumIndex?symbol=${symbol}`;
		try {
			return await this.routes.get<IFuturesMarkPrice>(uri);
		} catch (error) {
			throw error;
		}
	}

	private createWebsocketConnection<T>(
		uri: string,
		{
			onMessageHandler,
			onErrorHandler,
			onCloseHandler,
			onOpenHandler,
		}: IWebSocketProps<T>
	) {
		if (this.websocketURL) {
			const wsConnection = new WebSocket(this.websocketURL + uri);
			onOpenHandler &&
				wsConnection.addEventListener("open", (event) => {
					console.log(`${uri} CONNECTION OPENED`);
					onOpenHandler(event);
				});
			wsConnection.addEventListener("message", (event) => {
				const data = JSON.parse(event.data.toString());
				onMessageHandler(data);
			});

			onErrorHandler && wsConnection.addEventListener("error", onErrorHandler);

			onCloseHandler &&
				wsConnection.addEventListener("close", (event) => {
					console.log(`${uri} CONNECTION CLOSED`);
					onCloseHandler(event);
				});

			return wsConnection;
		}
	}

	connectMarkPriceStream(
		symbol: string,
		handlers: IWebSocketProps<IWSMarkPrice>
	) {
		const uri = `${symbol}@markPrice@1s`;
		return this.createWebsocketConnection<IWSMarkPrice>(uri, handlers);
	}
}
