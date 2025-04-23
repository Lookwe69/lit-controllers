import { ReactiveControllerHost } from 'lit';

import { ArrayOneOrMore } from '@lookwe/utils/types';

import { EffectController, EffectControllerOptions } from './effect-controller.js';

/**
 * A controller that manages a group of `EffectController` instances.
 */
export class EffectGroupController {
	#host;
	#controllers;

	constructor(
		host: ReactiveControllerHost,
		// eslint-disable-next-line  @typescript-eslint/no-explicit-any
		...effects: ArrayOneOrMore<(host: ReactiveControllerHost) => EffectController<any>>
	) {
		this.#host = host;
		this.#controllers = effects.map((effect) => effect(host));
	}

	/**
	 * Removes all the `EffectController` instances from the host.
	 */
	removeControllers() {
		this.#controllers.forEach((controller) => this.#host.removeController(controller));
	}

	/**
	 * Adds all the `EffectController` instances back to the host.
	 */
	addControllers() {
		this.#controllers.forEach((controller) => this.#host.addController(controller));
	}
}

/**
 * A function that creates an `EffectController` instance with the provided configuration.
 */
export function effect<const TDeps extends ReadonlyArray<unknown>>(
	callback: (deps: TDeps, prevDeps: TDeps | undefined) => void,
	deps: () => TDeps,
	options?: EffectControllerOptions,
) {
	return (host: ReactiveControllerHost) => new EffectController(host, callback, deps, options);
}
