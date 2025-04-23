import { ReactiveController, ReactiveControllerHost } from 'lit';

import { shallowArrayEquals } from '@lookwe/utils/array';

export interface EffectControllerOptions {
	/**
	 * The strategy for when to call the effect callback. Can be either "update" (before the next render) or "updated"
	 * (after the next render). Defaults to "update".
	 */
	strategy?: 'update' | 'updated';
}

/**
 * A reactive controller that runs an effect callback whenever its dependencies change.
 */
export class EffectController<const TDeps extends ReadonlyArray<unknown>> implements ReactiveController {
	#host: ReactiveControllerHost;
	#callback: (deps: TDeps, prevDeps: TDeps | undefined) => void;
	#deps: () => TDeps;
	#options: Required<EffectControllerOptions>;

	#lastDeps: TDeps | undefined;

	constructor(
		host: ReactiveControllerHost,
		callback: (deps: TDeps, prevDeps: TDeps | undefined) => void,
		deps: () => TDeps,
		options: EffectControllerOptions = {},
	) {
		(this.#host = host).addController(this);
		this.#callback = callback;
		this.#deps = deps;
		this.#options = { strategy: 'update', ...options };
	}

	hostUpdate(): void {
		if (!this.#canPerform('update')) return;
		this.#performEffect();
	}

	hostUpdated(): void {
		if (!this.#canPerform('updated')) return;
		this.#performEffect();
	}

	#canPerform(strategy: 'update' | 'updated') {
		if (this.#options.strategy !== strategy) return false;
		return true;
	}

	/**
	 * Performs the effect by calling the callback function with the current and previous dependencies.
	 */
	#performEffect() {
		const deps = this.#deps.call(this.#host);
		if (this.#lastDeps && shallowArrayEquals(this.#lastDeps, deps)) return;

		this.#callback.call(this.#host, deps, this.#lastDeps);

		this.#lastDeps = deps;
	}
}
