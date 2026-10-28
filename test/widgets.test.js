const helper = require('@iobroker/vis-2-widgets-testing');
const assert = require('node:assert/strict');
const adapterName = require('../package.json').name.split('.').pop();

describe('vis-2-widgets-jsontemplate', () => {
    before(async function () {
        this.timeout(3000000);
        // Install js-controller, web and a compatible vis-2 version.
        await helper.startIoBroker();
        await helper.startBrowser(process.env.CI === 'true' ? 'new' : false);
        await helper.createProject();

        // open widgets
        await helper.palette.openWidgetSet(null, adapterName);
        await helper.screenshot(null, '02_widgets_opened');
    });

    it('Check all widgets', async function () {
        this.timeout(120000);
        const widgets = await helper.palette.getListOfWidgets(null, adapterName);
        assert.ok(widgets.length, 'The widget set must expose at least one widget');
        for (let w = 0; w < widgets.length; w++) {
            const wid = await helper.palette.addWidget(null, widgets[w]);
            await helper.screenshot(null, `10_${widgets[w]}`);
            await helper.view.deleteWidget(null, wid);
        }
        return Promise.resolve();
    });

    after(async function () {
        this.timeout(5000);
        await helper.stopBrowser();
        return helper.stopIoBroker();
    });
});
