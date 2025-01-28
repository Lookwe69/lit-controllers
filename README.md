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
import { state } from 'lit/decorators.js';

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

[Playground](https://lit.dev/playground/#project=W3sibmFtZSI6Im15LWVsZW1lbnQudHMiLCJjb250ZW50IjoiaW1wb3J0IHsgaHRtbCwgTGl0RWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJ2xpdC9kZWNvcmF0b3JzLmpzJztcblxuaW1wb3J0IHsgRWZmZWN0Q29udHJvbGxlciB9IGZyb20gJ0Bsb29rd2UvbGl0LWNvbnRyb2xsZXJzJztcblxuY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgTGl0RWxlbWVudCB7XG5cdEBzdGF0ZSgpIGFjY2Vzc29yIGNvdW50ID0gMDtcblxuXHQvLyBFZmZlY3RDb250cm9sbGVyOiBFeGVjdXRlcyB0aGUgZWZmZWN0IHdoZW4gYGNvdW50YCBjaGFuZ2VzXG5cdCNfZWZmZWN0Q29udHJvbGxlciA9IG5ldyBFZmZlY3RDb250cm9sbGVyKFxuXHRcdHRoaXMsXG5cdFx0KFtjb3VudF0sIHByZXZEZXBzKSA9PiB7XG5cdFx0XHRjb25zdCBbcHJldmlvdXNDb3VudF0gPSBwcmV2RGVwcyA_PyBbXTtcblx0XHRcdGNvbnNvbGUubG9nKCdFZmZlY3QgdHJpZ2dlcmVkIScpO1xuXHRcdFx0Y29uc29sZS5sb2coJ0N1cnJlbnQgY291bnQ6JywgY291bnQpO1xuXHRcdFx0Y29uc29sZS5sb2coJ1ByZXZpb3VzIGNvdW50OicsIHByZXZpb3VzQ291bnQpO1xuXHRcdH0sXG5cdFx0KCkgPT4gW3RoaXMuY291bnRdLCAvLyBEZXBlbmRlbmNpZXMgKHRoZSBgY291bnRgIHByb3BlcnR5KVxuXHRcdHsgc3RyYXRlZ3k6ICd1cGRhdGVkJyB9LCAvLyBFZmZlY3Qgd2lsbCBydW4gYWZ0ZXIgdGhlIHJlbmRlclxuXHQpO1xuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gaHRtbGBcblx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLiNpbmNyZW1lbnR9XCI-SW5jcmVtZW50PC9idXR0b24-XG5cdFx0XHQ8cD5Db3VudDogJHt0aGlzLmNvdW50fTwvcD5cblx0XHRgO1xuXHR9XG5cblx0I2luY3JlbWVudCgpIHtcblx0XHR0aGlzLmNvdW50ICs9IDE7XG5cdH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnbXktZWxlbWVudCcsIE15RWxlbWVudCk7In0seyJuYW1lIjoiaW5kZXguaHRtbCIsImNvbnRlbnQiOiI8IURPQ1RZUEUgaHRtbD5cbjxoZWFkPlxuICA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBzcmM9XCIuL215LWVsZW1lbnQuanNcIj48L3NjcmlwdD5cbjwvaGVhZD5cbjxib2R5PlxuICA8bXktZWxlbWVudD48L215LWVsZW1lbnQ-XG48L2JvZHk-XG4ifSx7Im5hbWUiOiJwYWNrYWdlLmpzb24iLCJjb250ZW50Ijoie1xuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaXRcIjogXCJeMy4wLjBcIixcbiAgICBcIkBsaXQvcmVhY3RpdmUtZWxlbWVudFwiOiBcIl4yLjAuMFwiLFxuICAgIFwibGl0LWVsZW1lbnRcIjogXCJeNC4wLjBcIixcbiAgICBcImxpdC1odG1sXCI6IFwiXjMuMC4wXCIsXG4gICAgXCJAbG9va3dlL2xpdC1jb250cm9sbGVyc1wiOiBcIipcIlxuICB9XG59In1d)

Parameters:

- `callback`: The function called with the current and previous dependencies.
- `deps`: A function that returns an array of dependencies.
- `options` (optional): Set the strategy to "update" (before the render) or "updated" (after the render).

### EffectGroupController

The `EffectGroupController` manages multiple `EffectController` instances, grouping them together based on shared dependencies. You can add or remove all controllers at once from the host element.

```ts
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

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

[Playground](https://lit.dev/playground/#project=W3sibmFtZSI6Im15LWVsZW1lbnQudHMiLCJjb250ZW50IjoiaW1wb3J0IHsgaHRtbCwgTGl0RWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJ2xpdC9kZWNvcmF0b3JzLmpzJztcblxuaW1wb3J0IHsgZWZmZWN0LCBFZmZlY3RHcm91cENvbnRyb2xsZXIgfSBmcm9tICdAbG9va3dlL2xpdC1jb250cm9sbGVycyc7XG5cbmNsYXNzIE15RWxlbWVudCBleHRlbmRzIExpdEVsZW1lbnQge1xuXHRAc3RhdGUoKSBhY2Nlc3NvciBjb3VudCA9IDA7XG5cdEBzdGF0ZSgpIGFjY2Vzc29yIG5hbWUgPSAnSm9obic7XG5cblx0Ly8gRWZmZWN0R3JvdXBDb250cm9sbGVyOiBFeGVjdXRlcyBtdWx0aXBsZSBlZmZlY3RzIHRvZ2V0aGVyXG5cdCNfZWZmZWN0cyA9IG5ldyBFZmZlY3RHcm91cENvbnRyb2xsZXIoXG5cdFx0dGhpcyxcblx0XHRlZmZlY3QoXG5cdFx0XHQoW2NvdW50XSkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRWZmZWN0IDEgdHJpZ2dlcmVkIScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnQ3VycmVudCBjb3VudDonLCBjb3VudCk7XG5cdFx0XHR9LFxuXHRcdFx0KCkgPT4gW3RoaXMuY291bnRdLFxuXHRcdCksXG5cblx0XHRlZmZlY3QoXG5cdFx0XHQoW25hbWVdKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFZmZlY3QgMiB0cmlnZ2VyZWQhJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdDdXJyZW50IG5hbWU6JywgbmFtZSk7XG5cdFx0XHR9LFxuXHRcdFx0KCkgPT4gW3RoaXMubmFtZV0sXG5cdFx0KSxcblx0KTtcblxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIGh0bWxgXG5cdFx0XHQ8YnV0dG9uIEBjbGljaz1cIiR7dGhpcy4jaW5jcmVtZW50fVwiPkluY3JlbWVudDwvYnV0dG9uPlxuXHRcdFx0PGJ1dHRvbiBAY2xpY2s9XCIke3RoaXMuI2NoYW5nZU5hbWV9XCI-Q2hhbmdlIE5hbWU8L2J1dHRvbj5cblx0XHRcdDxwPkNvdW50OiAke3RoaXMuY291bnR9PC9wPlxuXHRcdFx0PHA-TmFtZTogJHt0aGlzLm5hbWV9PC9wPlxuXHRcdGA7XG5cdH1cblxuXHQjaW5jcmVtZW50KCkge1xuXHRcdHRoaXMuY291bnQgKz0gMTtcblx0fVxuXG5cdCNjaGFuZ2VOYW1lKCkge1xuXHRcdHRoaXMubmFtZSA9IHRoaXMubmFtZSA9PT0gJ0pvaG4nID8gJ0phbmUnIDogJ0pvaG4nO1xuXHR9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ215LWVsZW1lbnQnLCBNeUVsZW1lbnQpOyJ9LHsibmFtZSI6ImluZGV4Lmh0bWwiLCJjb250ZW50IjoiPCFET0NUWVBFIGh0bWw-XG48aGVhZD5cbiAgPHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgc3JjPVwiLi9teS1lbGVtZW50LmpzXCI-PC9zY3JpcHQ-XG48L2hlYWQ-XG48Ym9keT5cbiAgPG15LWVsZW1lbnQ-PC9teS1lbGVtZW50PlxuPC9ib2R5PlxuIn0seyJuYW1lIjoicGFja2FnZS5qc29uIiwiY29udGVudCI6IntcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwibGl0XCI6IFwiXjMuMC4wXCIsXG4gICAgXCJAbGl0L3JlYWN0aXZlLWVsZW1lbnRcIjogXCJeMi4wLjBcIixcbiAgICBcImxpdC1lbGVtZW50XCI6IFwiXjQuMC4wXCIsXG4gICAgXCJsaXQtaHRtbFwiOiBcIl4zLjAuMFwiLFxuICAgIFwiQGxvb2t3ZS9saXQtY29udHJvbGxlcnNcIjogXCIqXCJcbiAgfVxufSJ9XQ)

Methods :

- `removeControllers()`: Removes all the `EffectController` instances from the host.
- `addControllers()`: Adds all the `EffectController` instances back to the host.

### MemoController

The `MemoController` memoizes the result of a callback function based on its dependencies. It prevents unnecessary re-evaluations when dependencies haven't changed.

```ts
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

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
		() => [this.#count],
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

[Playground](https://lit.dev/playground/#project=W3sibmFtZSI6Im15LWVsZW1lbnQudHMiLCJjb250ZW50IjoiaW1wb3J0IHsgaHRtbCwgTGl0RWxlbWVudCB9IGZyb20gJ2xpdCc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJ2xpdC9kZWNvcmF0b3JzLmpzJztcblxuaW1wb3J0IHsgTWVtb0NvbnRyb2xsZXIgfSBmcm9tICdAbG9va3dlL2xpdC1jb250cm9sbGVycyc7XG5cbmNsYXNzIE15RWxlbWVudCBleHRlbmRzIExpdEVsZW1lbnQge1xuXHRAc3RhdGUoKSBhY2Nlc3NvciBjb3VudCA9IDA7XG5cblx0Ly8gTWVtb0NvbnRyb2xsZXI6IE1lbW9pemVzIHRoZSByZXN1bHQgb2YgdGhlIGNhbGxiYWNrXG5cdCNtZW1vQ29udHJvbGxlciA9IG5ldyBNZW1vQ29udHJvbGxlcihcblx0XHR0aGlzLFxuXHRcdChbY291bnRdKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnTWVtb2l6ZWQgdmFsdWUgY2FsY3VsYXRlZCEnKTtcblx0XHRcdHJldHVybiBjb3VudCAqIDI7XG5cdFx0fSxcblx0XHQoKSA9PiBbdGhpcy5jb3VudF0sXG5cdCk7XG5cblx0cmVuZGVyKCkge1xuXHRcdHJldHVybiBodG1sYFxuXHRcdFx0PGJ1dHRvbiBAY2xpY2s9XCIke3RoaXMuI2luY3JlbWVudH1cIj5JbmNyZW1lbnQ8L2J1dHRvbj5cblx0XHRcdDxwPk1lbW9pemVkIHZhbHVlOiAke3RoaXMuI21lbW9Db250cm9sbGVyLnZhbHVlfTwvcD5cblx0XHRgO1xuXHR9XG5cblx0I2luY3JlbWVudCgpIHtcblx0XHR0aGlzLmNvdW50ICs9IDE7XG5cdH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnbXktZWxlbWVudCcsIE15RWxlbWVudCk7In0seyJuYW1lIjoiaW5kZXguaHRtbCIsImNvbnRlbnQiOiI8IURPQ1RZUEUgaHRtbD5cbjxoZWFkPlxuICA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBzcmM9XCIuL215LWVsZW1lbnQuanNcIj48L3NjcmlwdD5cbjwvaGVhZD5cbjxib2R5PlxuICA8bXktZWxlbWVudD48L215LWVsZW1lbnQ-XG48L2JvZHk-XG4ifSx7Im5hbWUiOiJwYWNrYWdlLmpzb24iLCJjb250ZW50Ijoie1xuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaXRcIjogXCJeMy4wLjBcIixcbiAgICBcIkBsaXQvcmVhY3RpdmUtZWxlbWVudFwiOiBcIl4yLjAuMFwiLFxuICAgIFwibGl0LWVsZW1lbnRcIjogXCJeNC4wLjBcIixcbiAgICBcImxpdC1odG1sXCI6IFwiXjMuMC4wXCIsXG4gICAgXCJAbG9va3dlL2xpdC1jb250cm9sbGVyc1wiOiBcIipcIlxuICB9XG59In1d)

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

[Playground](https://lit.dev/playground/#project=W3sibmFtZSI6Im15LWVsZW1lbnQudHMiLCJjb250ZW50IjoiaW1wb3J0IHsgaHRtbCwgTGl0RWxlbWVudCB9IGZyb20gJ2xpdCc7XG5cbmltcG9ydCB7IFNsb3RDb250cm9sbGVyIH0gZnJvbSAnQGxvb2t3ZS9saXQtY29udHJvbGxlcnMnO1xuXG5jbGFzcyBNeUVsZW1lbnQgZXh0ZW5kcyBMaXRFbGVtZW50IHtcblx0I3Nsb3RDb250cm9sbGVyID0gbmV3IFNsb3RDb250cm9sbGVyKHRoaXMpOyAvLyBNYW5hZ2VzIGFsbCBzbG90c1xuXG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gaHRtbGBcblx0XHRcdDxzbG90Pjwvc2xvdD5cblx0XHRcdDxzbG90IG5hbWU9XCJuYW1lZFwiPjwvc2xvdD5cblx0XHRcdDxwPkRlZmF1bHQgc2xvdCBoYXMgY29udGVudDogJHt0aGlzLiNzbG90Q29udHJvbGxlci5oYXNBc3NpZ25lZE5vZGVzKCkgPyAnWWVzJyA6ICdObyd9PC9wPlxuXHRcdFx0PHA-TmFtZWQgc2xvdCBoYXMgY29udGVudDogJHt0aGlzLiNzbG90Q29udHJvbGxlci5oYXNBc3NpZ25lZE5vZGVzKCduYW1lZCcpID8gJ1llcycgOiAnTm8nfTwvcD5cblx0XHRgO1xuXHR9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ215LWVsZW1lbnQnLCBNeUVsZW1lbnQpOyJ9LHsibmFtZSI6ImluZGV4Lmh0bWwiLCJjb250ZW50IjoiPCFET0NUWVBFIGh0bWw-XG48aGVhZD5cbiAgPHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgc3JjPVwiLi9teS1lbGVtZW50LmpzXCI-PC9zY3JpcHQ-XG48L2hlYWQ-XG48Ym9keT5cbiAgPG15LWVsZW1lbnQ-PC9teS1lbGVtZW50PlxuPC9ib2R5PlxuIn0seyJuYW1lIjoicGFja2FnZS5qc29uIiwiY29udGVudCI6IntcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwibGl0XCI6IFwiXjMuMC4wXCIsXG4gICAgXCJAbGl0L3JlYWN0aXZlLWVsZW1lbnRcIjogXCJeMi4wLjBcIixcbiAgICBcImxpdC1lbGVtZW50XCI6IFwiXjQuMC4wXCIsXG4gICAgXCJsaXQtaHRtbFwiOiBcIl4zLjAuMFwiLFxuICAgIFwiQGxvb2t3ZS9saXQtY29udHJvbGxlcnNcIjogXCIqXCJcbiAgfVxufSJ9XQ)

Parameters:

- `slotNames` (optional): An iterable of slot names to manage. If not provided, all slots are managed.

Methods:

- `getAssignedNodes(slotName?: string)`: Gets an array of assigned nodes for the specified slot.
- `getAssignedElements(slotName?: string)`: Gets an array of assigned elements for the specified slot.
- `hasAssignedNodes(slotName?: string)`: Checks if the specified slot has any assigned nodes.
- `hasAssignedElements(slotName?: string)`: Checks if the specified slot has any assigned elements.
