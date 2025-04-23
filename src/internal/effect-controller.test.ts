import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { EffectController } from './effect-controller.js';

@customElement('reactive-controller-host')
class ReactiveControllerHostElement extends LitElement {
	@property()
	accessor prop = '';
}

describe('EffectController', () => {
	async function setupHost() {
		const host = await fixture<ReactiveControllerHostElement>(
			html`<reactive-controller-host></reactive-controller-host>`,
		);
		return host;
	}

	it('auto call when the host update', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		new EffectController(host, callback, deps);
		host.requestUpdate();
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop], undefined);

		// Act
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(2);
		expect(callback).callCount(2);
		expect(callback).calledWith([host.prop], ['']);
	});
	it("if deps don't change, don't rerun callback", async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		new EffectController(host, callback, deps);
		host.requestUpdate();
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop], undefined);

		// Act
		host.requestUpdate(); // host update without change
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(2);
		expect(callback).calledOnceWith([host.prop], undefined);
	});

	it('`this` is binded to the host', async () => {
		// Arrange
		const host = await setupHost();
		function callback(this: ReactiveControllerHostElement) {
			expect(this).equal(host);
		}
		function deps(this: ReactiveControllerHostElement) {
			expect(this).equal(host);
			return [this.prop];
		}
		new EffectController(host, callback, deps);
		host.requestUpdate();
		await elementUpdated(host);
	});
});
