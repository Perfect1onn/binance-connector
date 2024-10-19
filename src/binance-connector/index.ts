import {
	Eoptions,
	fetchDecorator,
	Fututes,
	instanceModules,
	Routes,
} from "./modules";
import { IConnectorProps } from "./types";

export class Connector {
	public eoptions: Eoptions | null;
	public futures: Fututes | null;

	constructor(props: IConnectorProps) {
		const { options, modules } = props;
		const { apiKey } = options;

		modules.forEach(({ URL, variant, webSocketURL }) => {
			const fetch = fetchDecorator(URL, {
				headers: {
					"X-MBX-APIKEY": apiKey,
				},
			});

			const routes = new Routes(fetch);

			const ModuleClass = instanceModules[variant];
			// @ts-expect-error
			this[variant] = new ModuleClass(routes, webSocketURL);
		});
	}
}
