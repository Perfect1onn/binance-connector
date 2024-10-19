import { IFuturesPosition } from "./positions";
import { IOptionPosition } from "./positions/option/types";

export interface IPostitionResult {
	futures: IFuturesPosition & {
		positionId: string
		currentMarkPrice: number,
		pnl: number,
		profit: number
	} | null,
	eoptions:  IOptionPosition & {
		positionId: string
		profit: number,
		pnl: number
		entryMarkPrice: number
	}| null
}