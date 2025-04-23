import { ReactiveController, ReactiveControllerHost } from 'lit';

import { shallowArrayEquals } from '@lookwe/utils/array';

/**
 * A reactive controller that memoizes the result of a callback function based on its dependencies.
 *
 * @template TValue  The type of the memoized value.
 * @template TDeps   The type of the dependencies array.
 */
export class MemoController<TValue, const TDeps extends ReadonlyArray<unknown>> implements ReactiveController {
	#host: ReactiveControllerHost;
	#callback: (deps: TDeps) => TValue;
	#lastDeps: TDeps | undefined;
	#deps: () => TDeps;

	#needRefreshValue = true;

	#value!: TValue;

	/**
	 * Gets the memoized value.
	 */
	get value(): TValue {
		if (this.#needRefreshValue) this.#refreshValue();
		this.#needRefreshValue = false;
		return this.#value;
	}

	/**
	 * Gets the memoized value, optionally forcing a re-evaluation of the dependencies.
	 */
	getValue(forceCheckDeps = false) {
		if (forceCheckDeps) this.#needRefreshValue = true;
		return this.value;
	}

	constructor(host: ReactiveControllerHost, callback: (deps: TDeps) => TValue, deps: () => TDeps) {
		(this.#host = host).addController(this);
		this.#callback = callback;
		this.#deps = deps;
	}

	hostUpdate(): void {
		this.#needRefreshValue = true;
	}

	/**
	 * Re-evaluates the memoized value if the dependencies have changed.
	 */
	#refreshValue() {
		const deps = this.#deps.call(this.#host);
		if (this.#lastDeps && shallowArrayEquals(this.#lastDeps, deps)) return;

		this.#lastDeps = deps;

		this.#value = this.#callback.call(this.#host, this.#lastDeps);
	}
}
