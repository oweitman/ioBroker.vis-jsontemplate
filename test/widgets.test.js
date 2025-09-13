const helper = require('@iobroker/vis-2-widgets-testing');
const adapterName = require('../package.json').name.split('.').pop();

/* describe('vis-2-widgets-jsontemplate', () => {
    before(async function () {
        this.timeout(250000);
        // install js-controller, web and vis-2-beta
        await helper.startIoBroker();
        await helper.startBrowser(process.env.CI === 'true' ? 'new' : false);
        await helper.createProject(undefined, 50000);

        // open widgets
        await helper.palette.openWidgetSet(null, "jsontemplate", 50000);
        await helper.screenshot(null, '02_widgets_opened');
    });

     it('Check all widgets', async function () {
        this.timeout(60000);
        const widgets = await helper.palette.getListOfWidgets(null, adapterName);
        for (let w = 0; w < widgets.length; w++) {
            const wid = await helper.palette.addWidget(null, widgets[w], 5000);
            await helper.screenshot(null, `10_${widgets[w]}`);
            await helper.view.deleteWidget(null, wid);
        }
        return Promise.resolve();
    }); 

    after(async function () {
        this.timeout(50000);
        await helper.stopBrowser();
        return helper.stopIoBroker();
    });
}); 
*/