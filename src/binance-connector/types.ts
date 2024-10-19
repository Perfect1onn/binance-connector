import { Event, ErrorEvent, CloseEvent } from "ws";
import { IModule } from "./modules";

interface IOptions {
	apiKey: string;
	secretKey?: string;
}

export interface IConnectorProps {
	options: IOptions;
	modules: IModule[];
}

export interface IError {
	code: number;
	msg: string;
}

export interface IWebSocketProps<T> {
	onMessageHandler: (data: T) => void;
	onErrorHandler?: (event: ErrorEvent) => void;
	onCloseHandler?: (event: CloseEvent) => void;
	onOpenHandler?: (event: Event) => void;
}
