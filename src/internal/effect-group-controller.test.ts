import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { EffectController } from './effect-controller';
import { effect, EffectGroupController } from './effect-group-controller';

@customElement('reactive-controller-host')
class ReactiveControllerHostElement extends LitElement {
	@property()
	accessor prop = '';

	@property({ type: Number })
	accessor prop2 = 0;
}

describe('effect', () => {
	it('returns a function to initialized a EffectController', () => {
		// Arrange
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => ['test']);
		const initController = effect(callback, deps);

		// Assert
		expect(typeof initController).equal('function');

		// Act
		const controller = initController(new ReactiveControllerHostElement());

		// Assert
		expect(controller).instanceof(EffectController);
	});
});

describe('EffectGroupController', () => {
	async function setupHost() {
		const host = await fixture<ReactiveControllerHostElement>(
			html`<reactive-controller-host></reactive-controller-host>`,
		);
		return host;
	}

	it('auto call sub-controllers when the host update', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const callback2 = sinon.fake(() => 'value2');
		const deps2 = sinon.fake(() => [host.prop2]);
		new EffectGroupController(host, effect(callback, deps), effect(callback2, deps2));
		host.requestUpdate();
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop], undefined);
		expect(deps2).callCount(1);
		expect(callback2).calledOnceWith([host.prop2], undefined);

		// Act
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(2);
		expect(callback).callCount(2);
		expect(callback).calledWith([host.prop], ['']);
		expect(deps2).callCount(2);
		expect(callback2).callCount(1);

		// Act
		host.prop2 = 10;
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(3);
		expect(callback).callCount(2);
		expect(deps2).callCount(3);
		expect(callback2).callCount(2);
		expect(callback2).calledWith([host.prop2], [0]);
	});

	it('removeControllers remove all sub-controllers', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const effects = new EffectGroupController(host, effect(callback, deps));
		host.requestUpdate();
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop], undefined);

		// Act
		effects.removeControllers();
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).callCount(1);
	});

	it('addControllers re-add all sub-controllers', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const effects = new EffectGroupController(host, effect(callback, deps));
		host.requestUpdate();
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop], undefined);

		// Act
		effects.removeControllers();
		effects.addControllers();
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(2);
		expect(callback).callCount(2);
		expect(callback).calledWith([host.prop], ['']);
	});
});
