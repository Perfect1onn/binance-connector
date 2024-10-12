import { IWebSocketProps } from "@/types";
import { Routes } from "../DecoratorFetch";
import {
	IExchangeInformation,
	IOpenInterest,
	IOptionMarkPrice,
	ISymbolIndexPrice,
	IWSIndexPrice,
	IWSMarkPrice,
	IWSTicker,
} from "./types";
import { WebSocket } from "ws";

export class Eoptions {
	private routes: Routes;
	private websocketURL: string | undefined;

	constructor(routes: Routes, websocketURL?: string) {
		this.routes = routes;
		this.websocketURL = websocketURL;
	}

	async getOptionMarkPrice(symbol?: string) {
		const uri = "/eapi/v1/mark";
		try {
			return await this.routes.get<IOptionMarkPrice[]>(
				symbol ? uri + `?symbol=${symbol}` : uri
			);
		} catch (error) {
			throw error;
		}
	}

	async getOpenInterest(underlyingAsset: string, expirationDate: string) {
		const uri = `/eapi/v1/openInterest?underlyingAsset=${underlyingAsset}&expiration=${expirationDate}`;
		try {
			return await this.routes.get<IOpenInterest[]>(uri);
		} catch (error) {
			throw error;
		}
	}

	async getSymbolIndexPrice(symbol: string) {
		const uri = `/eapi/v1/index?underlying=${symbol}`;
		try {
			return await this.routes.get<ISymbolIndexPrice>(uri);
		} catch (error) {
			throw error;
		}
	}

	async getExchangeInformation() {
		const uri = "/eapi/v1/exchangeInfo";
		try {
			return await this.routes.get<IExchangeInformation>(uri);
		} catch (error) {
			throw error;
		}
	}

	async createNewOrder() {
		const uri = "/eapi/v1/order";
		try {
			return await this.routes.post<IExchangeInformation>(uri);
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

	connectIndexPriceStream(
		symbol: string,
		handlers: IWebSocketProps<IWSIndexPrice>
	) {
		const uri = `${symbol}@index`;
		return this.createWebsocketConnection<IWSIndexPrice>(uri, handlers);
	}

	connectOptionStream(symbol: string, handlers: IWebSocketProps<IWSTicker>) {
		const uri = `${symbol}@ticker`;
		return this.createWebsocketConnection<IWSTicker>(uri, handlers);
	}

	connectMarkPriceStream(
		underlyingAsset: string,
		handlers: IWebSocketProps<IWSMarkPrice[]>
	) {
		const uri = `${underlyingAsset}@markPrice`;
		return this.createWebsocketConnection<IWSMarkPrice[]>(uri, handlers);
	}

	connectOptionByExpirationStream(
		underlyingAsset: string,
		expiration: string,
		handlers: IWebSocketProps<IWSTicker[]>
	) {
		const uri = `${underlyingAsset}@ticker@${expiration}`;
		return this.createWebsocketConnection<IWSTicker[]>(uri, handlers);
	}
}
