# lit-controllers

A collection of Lit.js reactive controllers for managing side effects, effect groups, memoization and slotted content in your Lit-based applications.

## Installation

You can install the library via npm :

```bash
npm i @lookwe/lit-controllers
```

## Usage

### EffectController

The `EffectController` runs a callback function whenever the specified dependencies change. You can control whether the effect runs before or after the render with the `strategy` option.

```ts
import { html, LitElement } from 'lit';
import { state } from 'lit/decorator.js';

import { EffectController } from '@lookwe/lit-controllers';

class MyElement extends LitElement {
	@state() accessor #count = 0;

	// EffectController: Executes the effect when `count` changes
	#_effectController = new EffectController(
		this,
		([count], prevDeps) => {
			const [previousCount] = prevDeps ?? [];
			console.log('Effect triggered!');
			console.log('Current count:', count);
			console.log('Previous count:', previousCount);
		},
		() => [this.#count], // Dependencies (the `count` property)
		{ strategy: 'updated' }, // Effect will run after the render
	);

	render() {
		return html`
			<button @click="${this.#increment}">Increment</button>
			<p>Count: ${this.#count}</p>
		`;
	}

	#increment() {
		this.#count += 1;
	}
}
customElements.define('my-element', MyElement);
```

Parameters:

- `callback`: The function called with the current and previous dependencies.
- `deps`: A function that returns an array of dependencies.
- `options` (optional): Set the strategy to "update" (before the render) or "updated" (after the render).

### EffectGroupController

The `EffectGroupController` manages multiple `EffectController` instances, grouping them together based on shared dependencies. You can add or remove all controllers at once from the host element.

```ts
import { html, LitElement } from 'lit';
import { state } from 'lit/decorator.js';

import { effect, EffectGroupController } from '@lookwe/lit-controllers';

class MyElement extends LitElement {
	@state() accessor #count = 0;
	@state() accessor #name = 'John';

	// EffectGroupController: Executes multiple effects together
	#_effects = new EffectGroupController(
		this,
		effect(
			([count]) => {
				console.log('Effect 1 triggered!');
				console.log('Current count:', count);
			},
			() => [this.#count],
		),

		effect(
			([name]) => {
				console.log('Effect 2 triggered!');
				console.log('Current name:', name);
			},
			() => [this.#name],
		),
	);

	render() {
		return html`
			<button @click="${this.#increment}">Increment</button>
			<button @click="${this.#changeName}">Change Name</button>
			<p>Count: ${this.#count}</p>
			<p>Name: ${this.#name}</p>
		`;
	}

	#increment() {
		this.#count += 1;
	}

	#changeName() {
		this.#name = this.#name === 'John' ? 'Jane' : 'John';
	}
}
customElements.define('my-element', MyElement);
```

Methods :

- `removeControllers()`: Removes all the `EffectController` instances from the host.
- `addControllers()`: Adds all the `EffectController` instances back to the host.

### MemoController

The `MemoController` memoizes the result of a callback function based on its dependencies. It prevents unnecessary re-evaluations when dependencies haven't changed.

```ts
import { html, LitElement } from 'lit';
import { state } from 'lit/decorator.js';

import { MemoController } from '@lookwe/lit-controllers';

class MyElement extends LitElement {
	@state() accessor #count = 0;

	// MemoController: Memoizes the result of the callback
	#memoController = new MemoController(
		this,
		([count]) => {
			console.log('Memoized value calculated!');
			return count * 2;
		},
		() => [this.count],
	);

	render() {
		return html`
			<button @click="${this.#increment}">Increment</button>
			<p>Memoized value: ${this.#memoController.value}</p>
		`;
	}

	#increment() {
		this.#count += 1;
	}
}
customElements.define('my-element', MyElement);
```

Parameters:

- `callback`: A function that computes the value based on the dependencies.
- `deps`: A function that returns the dependencies array.

Methods:

- `value`: Returns the memoized value.
- `getValue(forceCheckDeps = false)`: Returns the memoized value, optionally forcing a re-evaluation of the dependencies.

### SlotController

The `SlotController` manages slotted content and updates its host element when the slotted content changes. It provides helper methods for checking and retrieving assigned slot content.

```ts
import { html, LitElement } from 'lit';

import { SlotController } from '@lookwe/lit-controllers';

class MyElement extends LitElement {
	#slotController = new SlotController(this); // Manages all slots

	render() {
		return html`
			<slot></slot>
			<slot name="named"></slot>
			<p>Default slot has content: ${this.#slotController.hasAssignedNodes() ? 'Yes' : 'No'}</p>
			<p>Named slot has content: ${this.#slotController.hasAssignedNodes('named') ? 'Yes' : 'No'}</p>
		`;
	}
}
customElements.define('my-element', MyElement);
```

Parameters:

- `slotNames` (optional): An iterable of slot names to manage. If not provided, all slots are managed.

Methods:

- `getAssignedNodes(slotName?: string)`: Gets an array of assigned nodes for the specified slot.
- `getAssignedElements(slotName?: string)`: Gets an array of assigned elements for the specified slot.
- `hasAssignedNodes(slotName?: string)`: Checks if the specified slot has any assigned nodes.
- `hasAssignedElements(slotName?: string)`: Checks if the specified slot has any assigned elements.
