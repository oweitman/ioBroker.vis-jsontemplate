const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

describe('VIS-2 JSON template utilities', () => {
    let buildDatapoints;
    let parseJsonValue;
    let renderEjsTemplate;

    before(async () => {
        const moduleUrl = pathToFileURL(path.join(__dirname, '..', 'src-widgets', 'src', 'templateUtils.js'));
        ({ buildDatapoints, parseJsonValue, renderEjsTemplate } = await import(moduleUrl.href));
    });

    it('parses JSON objects and keeps object values', () => {
        const objectValue = { value: 42 };

        assert.deepEqual(parseJsonValue('{"enabled":false,"count":0}'), { enabled: false, count: 0 });
        assert.equal(parseJsonValue(objectValue), objectValue);
        assert.deepEqual(parseJsonValue('[1,2]'), [1, 2]);
        assert.deepEqual(parseJsonValue('invalid JSON'), {});
        assert.equal(parseJsonValue(0), 0);
        assert.equal(parseJsonValue(false), false);
    });

    it('builds datapoints including falsy values and legacy field names', () => {
        const data = {
            dpcount: 3,
            json_dp1: 'test.zero',
            'json_dp-2': 'test.false',
            'datapoint-oid3': 'test.empty',
        };
        const values = {
            'test.zero.val': 0,
            'test.false.val': false,
            'test.empty.val': '',
        };

        assert.deepEqual(buildDatapoints(data, values), {
            'test.zero': 0,
            'test.false': false,
            'test.empty': '',
        });
    });

    it('renders asynchronous EJS templates', async () => {
        const html = await renderEjsTemplate('<%= await Promise.resolve(value) %>', { value: 'ready' });

        assert.equal(html, 'ready');
    });
});
