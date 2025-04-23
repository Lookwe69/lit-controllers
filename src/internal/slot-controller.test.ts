import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { SlotController } from './slot-controller.js';

@customElement('reactive-controller-host')
class ReactiveControllerHostElement extends LitElement {
	@property({ attribute: false })
	accessor template: unknown;

	override render() {
		return this.template;
	}
}

describe('SlotController', () => {
	async function setupHost(template: TemplateResult) {
		const host = await fixture<ReactiveControllerHostElement>(
			html`<reactive-controller-host .template=${template}></reactive-controller-host>`,
		);
		return host;
	}

	it('correctly identifies assigned elements / nodes in a slot', async () => {
		const host = await setupHost(html`<slot></slot>`);
		const slotController = new SlotController(host);

		const span = document.createElement('span');
		span.textContent = 'Test Element';
		host.appendChild(span);
		host.append('Test Node');

		const assignedElements = slotController.getAssignedElements();
		expect(slotController.hasAssignedElements()).equal(true);
		expect(assignedElements).length(1);
		expect(assignedElements![0]!.textContent).equal('Test Element');

		const assignedNodes = slotController.getAssignedNodes();
		expect(slotController.hasAssignedNodes()).equal(true);
		expect(assignedNodes).length(2);
		expect(assignedNodes![0]!.textContent).equal('Test Element');
		expect(assignedNodes![1]!.textContent).equal('Test Node');
	});

	it('correctly identifies assigned elements / nodes in a named slot', async () => {
		const host = await setupHost(html`<slot name="named-slot"></slot>`);
		const slotController = new SlotController(host, ['named-slot']);

		const span = document.createElement('span');
		span.slot = 'named-slot';
		span.textContent = 'Named Test Element';
		host.appendChild(span);

		const assignedElements = slotController.getAssignedElements('named-slot');
		expect(slotController.hasAssignedElements('named-slot')).equal(true);
		expect(assignedElements).length(1);
		expect(assignedElements![0]!.textContent).equal('Named Test Element');

		const assignedNodes = slotController.getAssignedElements('named-slot');
		expect(slotController.hasAssignedNodes('named-slot')).equal(true);
		expect(assignedNodes).length(1);
		expect(assignedNodes![0]!.textContent).equal('Named Test Element');
	});

	it('trigger update for observed slot', async () => {
		const host = await setupHost(html`<slot name="observed-slot"></slot>`);
		new SlotController(host, ['observed-slot']);
		const requestUpdateSpy = sinon.spy(host, 'requestUpdate');

		expect(requestUpdateSpy).callCount(0);

		const span = document.createElement('span');
		span.slot = 'observed-slot';
		host.appendChild(span);
		await elementUpdated(host);

		expect(requestUpdateSpy).callCount(1);
	});

	it('does not trigger update for unobserved slot', async () => {
		const host = await setupHost(html`<slot name="observed-slot"></slot><slot name="unobserved-slot"></slot>`);
		new SlotController(host, ['observed-slot']);
		const requestUpdateSpy = sinon.spy(host, 'requestUpdate');

		const span = document.createElement('span');
		span.slot = 'unobserved-slot';
		host.appendChild(span);
		await elementUpdated(host);

		expect(requestUpdateSpy).callCount(0);
	});

	it('observes all slots if no slotNames are provided', async () => {
		const host = await setupHost(html`<slot name="slot1"></slot><slot name="slot2"></slot>`);
		new SlotController(host);
		const requestUpdateSpy = sinon.spy(host, 'requestUpdate');

		const missingSpan = document.createElement('span');
		missingSpan.slot = 'missing-slot';
		host.appendChild(missingSpan);
		await elementUpdated(host);

		expect(requestUpdateSpy).callCount(0);

		const span1 = document.createElement('span');
		span1.slot = 'slot1';
		host.appendChild(span1);
		await elementUpdated(host);

		expect(requestUpdateSpy).callCount(1);

		const span2 = document.createElement('span');
		span2.slot = 'slot2';
		host.appendChild(span2);
		await elementUpdated(host);

		expect(requestUpdateSpy).callCount(2);
	});
});
