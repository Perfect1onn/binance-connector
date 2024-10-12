import { Routes } from "./DecoratorFetch/index";
import { Eoptions } from "./Eoptions";
import { Fututes } from "./Futures";
export { Eoptions } from "./Eoptions";
export { Fututes } from "./Futures";
export { Routes, fetchDecorator } from "./DecoratorFetch/index";

type TModuleVariants = "eoptions" | "futures";

export interface IModule {
	URL: string;
	variant: TModuleVariants;
	webSocketURL?: string;
}

type IInstanceModules = Record<
	TModuleVariants,
	new (routes: Routes, webSocketURL?: string) => Eoptions | Fututes
>;

export const instanceModules: IInstanceModules = {
	eoptions: Eoptions,
	futures: Fututes,
};
