import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A reactive controller that manages slotted content and updates its host element when the slotted content changes.
 * Provides helper methods for checking and retrieving assigned slot content.
 */
export class SlotController<TSlotNames extends string = string> implements ReactiveController {
	#host: ReactiveControllerHost & Element;
	#slotNames: Set<string> | undefined;

	constructor(host: ReactiveControllerHost & Element, slotNames?: Iterable<TSlotNames>) {
		(this.#host = host).addController(this);
		this.#slotNames = slotNames === undefined ? undefined : new Set(slotNames);
	}

	#getSlot(slotName?: TSlotNames) {
		const slotSelector = `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
		const slot = this.#host.shadowRoot?.querySelector<HTMLSlotElement>(slotSelector) ?? null;
		return slot;
	}

	/**
	 * Gets an array of assigned nodes for the specified slot.
	 */
	getAssignedNodes(slotName?: TSlotNames): Array<Node> | undefined {
		return this.#getSlot(slotName)?.assignedNodes({ flatten: true });
	}

	/**
	 * Gets an array of assigned elements for the specified slot.
	 */
	getAssignedElements(slotName?: TSlotNames): Array<Element> | undefined {
		return this.#getSlot(slotName)?.assignedElements({ flatten: true });
	}

	/**
	 * Checks if the specified slot has any assigned nodes.
	 */
	hasAssignedNodes(slotName?: TSlotNames): boolean {
		return (this.getAssignedNodes(slotName)?.length ?? 0) > 0;
	}

	/**
	 * Checks if the specified slot has any assigned elements.
	 */
	hasAssignedElements(slotName?: TSlotNames): boolean {
		return (this.getAssignedElements(slotName)?.length ?? 0) > 0;
	}

	#handleSlotChange(event: Event) {
		const slot = event.target as HTMLSlotElement;

		if (this.#slotNames === undefined || this.#slotNames.has(slot.name)) {
			this.#host.requestUpdate();
		}
	}

	#clearController?: AbortController;

	hostConnected() {
		this.#clearController ??= new AbortController();
		const signal = this.#clearController.signal;

		this.#host.shadowRoot?.addEventListener('slotchange', this.#handleSlotChange.bind(this), { signal });
	}

	hostDisconnected() {
		this.#clearController?.abort();
	}
}
