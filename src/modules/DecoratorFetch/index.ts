import { IError } from "@/types";

interface IOptions {
	headers?: RequestInit["headers"];
	body?: RequestInit["body"];
	method?: RequestInit["method"];
}
export interface ISuccessResponse<T> {
	data: T;
	error: null;
}

export interface IErrorResponse {
	data: null;
	error: IError;
}

export function fetchDecorator(URL: string, initOptions: RequestInit) {
	return async function <T>(URI: string, options: IOptions = {}): Promise<T> {
		if (options.body) {
			options.body = JSON.stringify(options.body);
		}

		const { headers: initHeaders } = initOptions;
		const currentHeaders = options.headers ?? {};

		try {
			const response = await global.fetch(URL + URI, {
				...initOptions,
				headers: { ...initHeaders, ...currentHeaders },
				body: options.body,
				method: options.method,
			});

			const data = await response.json();

			if (response.status >= 400) {
				throw data;
			}

			return data;
		} catch (err) {
			throw err;
		}
	};
}

type modifedFetch = <T>(URI: string, options?: IOptions) => Promise<T>;

export class Routes {
	private fetch: modifedFetch;

	constructor(fetch: modifedFetch) {
		this.fetch = fetch;
	}

	async get<T>(URI: string, options: IOptions = {}) {
		try {
			return await this.fetch<T>(URI, { ...options, method: "GET" });
		} catch (err) {
			throw err;
		}
	}

	async post<T>(URI: string, options: IOptions = {}) {
		try {
			return await this.fetch<T>(URI, { ...options, method: "POST" });
		} catch (err) {
			throw err;
		}
	}

	async delete<T>(URI: string, options: IOptions = {}) {
		try {
			return await this.fetch<T>(URI, { ...options, method: "delete" });
		} catch (err) {
			throw err;
		}
	}
}
