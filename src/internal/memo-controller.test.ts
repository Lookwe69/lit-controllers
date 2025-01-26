import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { MemoController } from './memo-controller';

@customElement('reactive-controller-host')
class ReactiveControllerHostElement extends LitElement {
	@property()
	accessor prop = '';

	notReactiveProp = '';
}

describe('MemoController', () => {
	async function setupHost() {
		const host = await fixture<ReactiveControllerHostElement>(
			html`<reactive-controller-host></reactive-controller-host>`,
		);
		return host;
	}

	it("don't auto call deps and callback, only when we need value", async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const memoController = new MemoController(host, callback, deps);
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(0);
		expect(callback).callCount(0);

		// Act
		const value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop]);
	});

	it('value is memoized', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const memoController = new MemoController(host, callback, deps);
		await elementUpdated(host);

		// Act
		let value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop]);

		// Act
		value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop]);
	});

	it('check if deps have changed when the host update', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const memoController = new MemoController(host, callback, deps);
		await elementUpdated(host);

		// Act
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(0);
		expect(callback).callCount(0);

		// Act
		let value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop]);

		// Act
		host.prop = 'change';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).callCount(1);

		// Act
		value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(2);
		expect(callback).callCount(2);
		expect(callback).calledWith([host.prop]);
	});

	it("if deps don't change, don't rerun callback, keeps previous value", async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => 'value');
		const deps = sinon.fake(() => [host.prop]);
		const memoController = new MemoController(host, callback, deps);
		await elementUpdated(host);

		// Act
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(0);
		expect(callback).callCount(0);

		// Act
		let value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop]);

		// Act
		host.requestUpdate(); // host update without change
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(1);
		expect(callback).callCount(1);

		// Act
		value = memoController.value;

		// Assert
		expect(value).equal('value');
		expect(deps).callCount(2);
		expect(callback).callCount(1);
	});

	it('`this` is binded to the host', async () => {
		// Arrange
		const host = await setupHost();
		function callback(this: ReactiveControllerHostElement) {
			expect(this).equal(host);
			return this.prop;
		}
		function deps(this: ReactiveControllerHostElement) {
			expect(this).equal(host);
			return [this.prop];
		}
		const memoController = new MemoController(host, callback, deps);
		host.prop = 'test';
		await elementUpdated(host);

		// Act
		const value = memoController.value;

		// Assert
		expect(value).equal('test');
	});

	it('can force check deps with getValue', async () => {
		// Arrange
		const host = await setupHost();
		const callback = sinon.fake(() => host.notReactiveProp);
		const deps = sinon.fake(() => [host.prop, host.notReactiveProp]);
		const memoController = new MemoController(host, callback, deps);
		await elementUpdated(host);

		// Act
		host.prop = 'test';
		await elementUpdated(host);

		// Assert
		expect(deps).callCount(0);
		expect(callback).callCount(0);

		// Act
		let value = memoController.getValue();

		// Assert
		expect(value).equal('');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop, '']);

		// Act
		host.notReactiveProp = 'test';
		await elementUpdated(host);
		value = memoController.getValue();

		// Assert
		expect(value).equal('');
		expect(deps).callCount(1);
		expect(callback).calledOnceWith([host.prop, '']);

		// Act
		value = memoController.getValue(true);

		// Assert
		expect(value).equal('test');
		expect(deps).callCount(2);
		expect(callback).callCount(2);
		expect(callback).calledWith([host.prop, 'test']);
	});
});
